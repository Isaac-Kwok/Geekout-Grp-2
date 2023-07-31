import React, { useState, useEffect, useContext } from 'react';
import { DialogContent, Grid, Paper, Divider, Container, Typography, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import { useSnackbar } from 'notistack';
import { CartContext } from './CartRoutes';
import { UserContext } from '../../index';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutPaymentForm from './CheckoutPaymentForm';
import http from "../../http";
import { validateUser } from '../../functions/user';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Checkout = () => {
    const { user } = useContext(UserContext); 
    const [items, setItems] = useState([]);
    const { selectedItems } = useContext(CartContext);
    const [loading, setLoading] = useState(true);
    const [clientSecret, setClientSecret] = useState("");
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    
    useEffect(() => {
        if (!validateUser()) {
            enqueueSnackbar("You must be logged in to view this page", { variant: "error" });
            navigate("/login");
        } else {
            document.title = 'Checkout';
            setLoading(true);
            http.get('/cart')
                .then((response) => {
                    const itemsData = response.data.map(item => {
                        return {
                            ...item,
                            product_name: item.Product.product_name,
                            product_picture: item.Product.product_picture,
                            product_price: item.Product.product_price
                        };
                    });
                    setItems(itemsData);
                    const selectedItemsDetails = itemsData.filter(item => selectedItems.includes(item.id));
                    const subtotal = selectedItemsDetails.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
                    const gst = (subtotal * 0.08).toFixed(2);
                    const total = (subtotal + parseFloat(gst)).toFixed(2);
                    http.post("/payment/topup", { amount: total })
                        .then((res) => {
                            if (res.status === 200) {
                                if (res.data && res.data.clientSecret) {
                                    setClientSecret(res.data.clientSecret);
                                    setLoading(false);
                                } else {
                                    enqueueSnackbar("Client secret is missing in the response.", { variant: "error" });
                                    setLoading(false);
                                }
                            } else {
                                enqueueSnackbar("Failed to create payment intent.", { variant: "error" });
                                setLoading(false);
                            }
                        })
                        .catch((err) => {
                            enqueueSnackbar("Top-up failed!", { variant: "error" });
                            setLoading(false);
                        });
                })
                .catch((error) => {
                    enqueueSnackbar('Error fetching cart items:', { variant: "error" });
                });
        }
    }, [selectedItems, enqueueSnackbar, navigate]);

    const getSubTotalPrice = () => {
        const selectedItemsDetails = items.filter(item => selectedItems.includes(item.id));
        return selectedItemsDetails.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
    }

    const getGST = () => {
        return (getSubTotalPrice() * 0.08).toFixed(2);
    }

    const getTotalPrice = () => {
        return (getSubTotalPrice() + parseFloat(getGST())).toFixed(2);
    }

    const removeItemsFromCart = async () => {
        const selectedItemsDetails = items.filter(item => selectedItems.includes(item.id));
        const itemIdsToRemove = selectedItemsDetails.map(item => item.id);
        try {
            const res = await http.post("/cart/removeItems", { itemsToRemove: itemIdsToRemove });
            if (res.status !== 200) {
                enqueueSnackbar(`Failed to remove some items from cart`, { variant: "error" });
            }
        } catch (error) {
            enqueueSnackbar(`Error removing items from cart`, { variant: "error" });
        }
    }

    const handleClose = async () => {
        await removeItemsFromCart();
        setClientSecret(null);
        navigate("/cart/checkout/success");
    
        // create order and order items after payment
        const selectedItemsDetails = items.filter(item => selectedItems.includes(item.id));
        const orderItems = selectedItemsDetails.map(item => ({
            product_id: item.Product.id,
            quantity: item.quantity,
            total_price: item.product_price * item.quantity,
        }));
    
        const subtotal = getSubTotalPrice();
        const gst = getGST();
        const total = getTotalPrice();
    
        try {
            const res = await http.post("/cart/checkout/confirm", {
                order: {
                    user_id: user.id,
                    total_amount: total,
                    status: 1,
                },
                orderItems
            });
            if (res.status !== 200) {
                enqueueSnackbar(`Failed to create order`, { variant: "error" });
            }
        } catch (error) {
            enqueueSnackbar(`Error creating order`, { variant: "error" });
        }
    }
    
    if (loading || !clientSecret) {
        return (
            <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Container>
        )
    }

    return (
        <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
            <Typography variant="h3" fontWeight={700} sx={{ marginY: ["1rem", "1rem", "2rem"], fontSize: ["2rem", "2rem", "3rem"] }}>Checkout</Typography>
            <Grid container spacing={2}>
                <Grid item xs={9}>
                    <Paper elevation={2} sx={{ padding: 2 }}>
                        <Elements stripe={stripePromise} options={{ clientSecret: clientSecret }}>
                            <CheckoutPaymentForm handleClose={handleClose} />
                        </Elements>
                    </Paper>
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
                                <ListItemText primary="Total" />
                                <Typography variant="h6">${getTotalPrice()}</Typography>
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Checkout;