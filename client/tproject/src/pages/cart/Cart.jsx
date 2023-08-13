import React, { useEffect, useState, useContext } from 'react';
import { List, ListItem, Divider, ListItemText, Grid, Box, CardMedia, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper, IconButton, Container, Typography, Button, CardContent, Card, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { validateUser } from '../../functions/user'
import http from "../../http";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RemoveIcon from '@mui/icons-material/Remove';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PageTitle from '../../components/PageTitle';
import CardTitle from '../../components/CardTitle';
import { useSnackbar } from 'notistack';
import { CartContext } from './CartRoutes';
import useUser from '../../context/useUser';


function ViewCart() {
    const { user } = useUser();
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
                        product_price: item.Product.product_price,
                        product_sale: item.Product.product_sale,
                        product_discounted_percent: item.Product.product_discounted_percent
                    }
                });
                setItems(itemsData);
                setLoading(false);
                console.log('Cart items fetched: ', itemsData);
            })
            .catch((error) => {
                console.error('Error fetching cart items:', error);
            });
    }


    const handleCheckboxChange = (event, item) => {
        const isChecked = event.target.checked;  // Store the check status here
        if (isChecked) {
            setSelectedItems(prevItems => {
                const newItems = [...prevItems, item.id];
                console.log('New selected items after addition: ', newItems);
                return newItems;
            });
        } else {
            setSelectedItems(prevItems => {
                const newItems = prevItems.filter(i => i !== item.id);
                console.log('New selected items after removal: ', newItems);
                return newItems;
            });
        }
    }


    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelectedItems = items.map((item) => item.id);
            setSelectedItems(newSelectedItems);
            console.log('All items selected: ', newSelectedItems);
        } else {
            setSelectedItems([]);
            console.log('All items deselected');
        }
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
        const total = items.reduce((sum, item) => {
            if (selectedItems.includes(item.id)) {
                let price = item.product_price;
                if (item.product_sale) {
                    price = item.product_price * (1 - item.product_discounted_percent / 100);
                }
                return sum + (price * item.quantity);
            }
            return sum;
        }, 0);

        // Ensure the result is a number, then convert it to a fixed decimal string.
        return parseFloat(total).toFixed(2);
    }



    const getGST = () => {
        var sumOfItems = getSubTotalPrice();
        return (sumOfItems * 0.08).toFixed(2);
    }

    const getTotalPrice = () => {
        var sumOfItems = parseFloat(getSubTotalPrice());
        var total = sumOfItems + parseFloat(getGST());
        return total.toFixed(2);
    }



    const clearCart = () => {
        try {
            http.delete('/cart')
                .then((response) => {
                    if (response.status === 200) {
                        handleGetCartItems();
                    }
                })
                .catch((error) => {
                    enqueueSnackbar("Error clearing cart", { variant: "error" });
                    console.error('Error clearing cart:', error);
                });
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    }


    return (
        <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
            <PageTitle title="Your Cart" subtitle="Review Items" />
            {items.length > 0 && (<><Button onClick={clearCart}>Clear Cart</Button></>)}
            <Grid container spacing={2} flexDirection={{ xs: "row-reverse", md: "row" }}>
                <Grid item xs={12} md={9}>
                    <TableContainer component={Paper}>
                        {items.length > 0 ? (
                            <>
                                <Table style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={items.length > 0 && selectedItems.length === items.length}
                                                    onChange={handleSelectAllClick}
                                                />
                                            </TableCell>
                                            <TableCell>Product Image</TableCell>
                                            <TableCell>Product</TableCell>
                                            <TableCell align="center">Unit Price</TableCell>
                                            <TableCell align="center">Quantity</TableCell>
                                            <TableCell align="center">Total Price</TableCell>
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {items.map((item, index) => {
                                            const isItemSelected = isSelected(item.id);
                                            const productPictures = item.Product.product_picture && Array.isArray(item.Product.product_picture)
                                                ? item.Product.product_picture
                                                : JSON.parse(item.Product.product_picture || '[]');
                                            return (
                                                <TableRow key={item.id} selected={isItemSelected}>
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            onChange={(event) => handleCheckboxChange(event, item)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <CardMedia
                                                            component="img"
                                                            sx={{
                                                                width: 80,
                                                                height: 80,
                                                                borderRadius: '8px',
                                                                objectFit: 'cover'
                                                            }}
                                                            image={`${productPath}${productPictures[0]}`}
                                                            alt={item.Product.product_name}
                                                        />
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        <Typography
                                                            style={{ cursor: 'pointer', fontWeight: '500' }}
                                                            onClick={() => navigate('/products/' + item.product_id)}>{item.product_name}</Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {item.product_sale ?
                                                            <><del>{parseFloat(item.product_price).toFixed(2)}</del> <span style={{ color: 'red' }}>{(parseFloat(item.product_price) * (1 - item.product_discounted_percent / 100)).toFixed(2)}</span></>
                                                            : parseFloat(item.product_price).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell align="center" style={{ width: '120px' }}>
                                                        <IconButton aria-label="minus" onClick={() => handleDecrementQuantity(item.id)}>
                                                            <RemoveIcon />
                                                        </IconButton>
                                                        <span style={{ display: 'inline-block', width: '30px', textAlign: 'center' }}>
                                                            {item.quantity}
                                                        </span>
                                                        <IconButton aria-label="plus" onClick={() => handleIncrementQuantity(item.id)}>
                                                            <AddIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {item.product_sale ?
                                                            (item.product_price * (1 - item.product_discounted_percent / 100) * item.quantity).toFixed(2)
                                                            : (item.product_price * item.quantity).toFixed(2)
                                                        }
                                                    </TableCell>

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
                            <Typography variant="h6" style={{ textAlign: 'center', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                Your cart is empty
                            </Typography>
                        )}
                    </TableContainer>

                    {!user?.delivery_address && <>
                        <Card sx={{ marginY: "1rem" }}>
                            <CardContent>
                                <CardTitle title="No Delivery Address" icon={<WarningAmberIcon />} />
                                <Typography variant="body1">
                                    You have not set a delivery address yet. Please set a delivery address before checking out.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    startIcon={<EditIcon />}
                                    variant="text"
                                    onClick={() => navigate('/profile/edit')}
                                >
                                    Edit Profile
                                </Button>
                            </CardActions>
                        </Card>
                    </>}
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <CardTitle title="Order Summary" icon={<RequestQuoteIcon />} />
                        </CardContent>
                        <List>
                            <ListItem>
                                <ListItemText primary="Subtotal" />
                                <Typography variant="h6">${getSubTotalPrice()}</Typography>
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="GST (8%)" />
                                <Typography variant="h6">${getGST()}</Typography>
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText primary="Total" />
                                <Typography variant="h6">${getTotalPrice()}</Typography>
                            </ListItem>
                        </List>
                        <CardActions>
                            <Button
                                startIcon={<ShoppingCartCheckoutIcon />}
                                variant="contained"
                                fullWidth
                                onClick={() => {
                                    if (selectedItems.length === 0) {
                                        enqueueSnackbar('No items selected!', { variant: 'error' });
                                    } else if (user.delivery_address === null) {
                                        enqueueSnackbar('Please add a delivery address!', { variant: 'error' });
                                    } else {
                                        navigate("/cart/checkout", { state: { items: selectedItems } });
                                    }
                                }}
                            >
                                Checkout
                            </Button>
                        </CardActions>
                    </Card>
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
