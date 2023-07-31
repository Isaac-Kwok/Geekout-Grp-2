import React, { useEffect, useState, useContext } from 'react';
import { List, ListItem, Divider, ListItemText, Grid, Box, CardMedia, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper, IconButton, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { validateUser } from '../../functions/user'
import http from "../../http";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useSnackbar } from 'notistack';
import { CartContext } from './CartRoutes';


function ViewCart() {
    const [items, setItems] = useState([]);
    const { selectedItems, setSelectedItems } = useContext(CartContext);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const productPath = `${import.meta.env.VITE_API_URL}/admin/products/productImage/`

    const handleGetCartItems = () => {
        http.get('/cart')
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
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching cart items:', error);
            });
    }

    const handleCheckboxChange = (event, item) => {
        if (event.target.checked) {
            setSelectedItems([...selectedItems, item.id]);
        } else {
            setSelectedItems(selectedItems.filter(i => i !== item.id));
        }
    }

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelectedItems = items.map((item) => item.id);
            setSelectedItems(newSelectedItems);
            return;
        }
        setSelectedItems([]);
    };

    const isSelected = (id) => selectedItems.indexOf(id) !== -1;

    const handleConfirmRemoveItem = () => {
        http.delete('/cart/' + selectedItem)
            .then((response) => {
                if (response.status === 200) {
                    handleGetCartItems();
                }
            })
            .catch((error) => {
                console.error('Error removing item from cart:', error);
            });
        setOpenDialog(false);
    }

    const handleIncrementQuantity = (itemId) => {
        const item = items.find(item => item.id === itemId);
        handleEditItemQuantity(itemId, item.quantity + 1);
    }

    const handleDecrementQuantity = (itemId) => {
        const item = items.find(item => item.id === itemId);
        if (item.quantity > 1) {
            handleEditItemQuantity(itemId, item.quantity - 1);
        }
    }

    const handleEditItemQuantity = (itemId, quantity) => {
        http.put('/cart/' + itemId, { quantity })
            .then((response) => {
                if (response.status === 200) {
                    handleGetCartItems();
                }
            })
            .catch((error) => {
                enqueueSnackbar("Maximum amount of quantity reached", { variant: "error" });
                console.error('Error updating item quantity:', error);
            });
    }

    const handleRemoveItem = (itemId) => {
        setSelectedItem(itemId);
        setOpenDialog(true);
    }

    useEffect(() => {
        if (!validateUser()) {
            enqueueSnackbar("You must be logged in to view this page", { variant: "error" })
            return navigate("/login")
        } else {
            document.title = 'Your Cart';
            handleGetCartItems()
        }
    }, [])

    const getSubTotalPrice = () => {
        return items.reduce((sum, item) => {
            if (selectedItems.includes(item.id)) {
                return sum + (item.product_price * item.quantity);
            } else {
                return sum;
            }
        }, 0);
    }

    const getGST = () => {
        var sumOfItems = getSubTotalPrice();
        return (sumOfItems * 0.08).toFixed(2);
    }

    const getTotalPrice = () => {
        var sumOfItems = getSubTotalPrice();
        return (sumOfItems + parseFloat(getGST())).toFixed(2);
    }

    return (
        <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
            <Typography variant="h3" fontWeight={700} sx={{ marginY: ["1rem", "1rem", "2rem"], fontSize: ["2rem", "2rem", "3rem"] }}>Your Cart</Typography>
            <Grid container spacing={2}>
                <Grid item xs={9}>
                    <TableContainer component={Paper}>
                        {items.length > 0 ?
                            (
                                <>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={items.length > 0 && selectedItems.length === items.length}
                                                        onChange={handleSelectAllClick}
                                                    />
                                                </TableCell>
                                                <TableCell>Product</TableCell>
                                                <TableCell>Product Image</TableCell>
                                                <TableCell align="center">Unit Price</TableCell>
                                                <TableCell align="center">Quantity</TableCell>
                                                <TableCell align="center">Total Price</TableCell>
                                                <TableCell align="center">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {items.map((item, index) => {
                                                const isItemSelected = isSelected(item.id);
                                                return (
                                                    <TableRow
                                                        key={item.id}
                                                        selected={isItemSelected}
                                                    >
                                                        <TableCell padding="checkbox">
                                                            <Checkbox
                                                                checked={isItemSelected}
                                                                onChange={(event) => handleCheckboxChange(event, item)}
                                                            />
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">
                                                            <Typography
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => navigate('/products/' + item.product_id)}>{item.product_name}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <CardMedia
                                                                component="img"
                                                                height="80px"
                                                                width="80px"
                                                                object-fit="cover"
                                                                image={`${productPath}${item.product_picture}`}
                                                                alt={item.product_name}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">{item.product_price}</TableCell>
                                                        <TableCell align="center">
                                                            <IconButton aria-label="minus" onClick={() => handleDecrementQuantity(item.id)}>
                                                                <RemoveIcon />
                                                            </IconButton>
                                                            {item.quantity}
                                                            <IconButton aria-label="plus" onClick={() => handleIncrementQuantity(item.id)}>
                                                                <AddIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                        <TableCell align="center">{item.product_price * item.quantity}</TableCell>
                                                        <TableCell align="center">
                                                            <IconButton aria-label="delete" onClick={() => handleRemoveItem(item.id)}>
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
                                <>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell colSpan={7} style={{textAlign: 'center', justifyContent: 'center', alignItems:'center'}}>
                                                    <Typography variant="h6">
                                                        Your cart is empty
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                    </Table>
                                </>
                            )
                        }
                    </TableContainer>
                </Grid>

                <Grid item xs={3}>
                    <Paper elevation={2} sx={{ padding: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Payment Summary
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemText primary="Subtotal" />
                                <Typography variant="h6">${getSubTotalPrice()}</Typography>
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="GST (8%)" />
                                <Typography variant="h6">${getGST()}</Typography>
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Delivery Fee" />
                                <Typography variant="h6">$0</Typography>
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Coupon" />
                                <Typography variant="h6">$0</Typography>
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText primary="Total" />
                                <Typography variant="h6">${getTotalPrice()}</Typography>
                            </ListItem>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    if (selectedItems.length === 0) {
                                        enqueueSnackbar('No items selected!', { variant: 'error' });
                                    } else {
                                        navigate("/cart/checkout", { state: { items: selectedItems } });
                                    }
                                }}
                            >
                                Checkout
                            </Button>
                        </List>
                    </Paper>
                </Grid>
            </Grid>
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            >
                <DialogTitle>Remove Item</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to remove this item from your cart?
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


export default ViewCart
