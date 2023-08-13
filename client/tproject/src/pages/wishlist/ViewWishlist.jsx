import React, { useEffect, useState, useContext } from 'react';
import { List, ListItem, Divider, ListItemText, Grid, Box, CardMedia, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper, IconButton, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { validateUser } from '../../functions/user'
import http from "../../http";
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
import { UserContext } from '../../index';
import PageTitle from '../../components/PageTitle';


function ViewWishlist() {
    const { user } = useContext(UserContext);
    const [items, setItems] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const productPath = `${import.meta.env.VITE_API_URL}/admin/products/productImage/`

    const handleGetWishlistItems = () => {
        http.get('/wishlist')
            .then((response) => {
                const itemsData = response.data.map(item => {
                    return {
                        ...item,
                        product_name: item.Product.product_name,
                        product_picture: item.Product.product_picture,
                        product_price: item.Product.product_price
                    }
                });
                setItems(itemsData);
            })
            .catch((error) => {
                console.error('Error fetching wishlist items:', error);
            });
    }

    const handleRemoveItem = (itemId) => {
        setSelectedItem(itemId);
        setOpenDialog(true);
    }

    const handleConfirmRemoveItem = () => {
        console.log()
        http.delete(`/wishlist/${selectedItem}`)
            .then((response) => {
                if (response.status === 200) {
                    handleGetWishlistItems();
                }
            })
            .catch((error) => {
                console.error('Error removing item from wishlist:', error);
            });
        setOpenDialog(false);
    }
    

    const clearWishlist = () => {
        setItems([]);
        http.delete('/wishlist')
            .then((response) => {
                if (response.status === 200) {
                    setItems([]);
                }
            })
            .catch((error) => {
                console.error('Error clearing wishlist:', error);
            });
    }


    useEffect(() => {
        if (!validateUser()) {
            enqueueSnackbar("You must be logged in to view this page", { variant: "error" })
            return navigate("/login")
        } else {
            document.title = 'Your Wishlist';
            handleGetWishlistItems()
        }
    }, [])

    return (
        <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
            <PageTitle title="Your Wishlist" subtitle="View Items" />
            {items.length > 0 && (<><Button onClick={clearWishlist}>Clear Wishlist</Button></>)}
            {items.length == 0 && (<><Button onClick={() => navigate('/products')}>Go to Products</Button></>)}
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        {items.length > 0 ?
                            (
                                <>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Product</TableCell>
                                                <TableCell>Product Image</TableCell>
                                                <TableCell align="center">Price</TableCell>
                                                <TableCell align="center">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {items.map((item, index) => {
                                                const productPictures = item.Product.product_picture && Array.isArray(item.Product.product_picture)
                                                    ? item.Product.product_picture
                                                    : JSON.parse(item.Product.product_picture || '[]');
                                                return (
                                                    <TableRow key={item.id}>
                                                        <TableCell component="th" scope="row">
                                                            <Typography
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => navigate('/products/' + item.product_id)}>{item.product_name}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <CardMedia
                                                                component="img"
                                                                sx={{
                                                                    width: 340,  // Automatically adjust width based on aspect ratio
                                                                    height: 140,    // Fixed height
                                                                    objectFit: 'cover'
                                                                }}
                                                                image={`${productPath}${productPictures[0]}`}
                                                                alt={item.Product.product_name}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">{item.product_price}</TableCell>
                                                        <TableCell align="center">
                                                            <IconButton aria-label="delete" onClick={() => handleRemoveItem(item.product_id)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </>
                            ) : (
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={7} style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                                <Typography variant="h6">
                                                    Your Wishlist is empty
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                </Table>
                            )
                        }
                    </TableContainer>
                </Grid>
            </Grid>
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            >
                <DialogTitle>Remove Item</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to remove this item from your wishlist?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmRemoveItem} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}


export default ViewWishlist
