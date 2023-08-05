import React, { useState, useEffect, useContext } from 'react';
import { DialogContent, Grid, Paper, Divider, Container, Typography, CircularProgress, List, ListItem, ListItemText, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import { CartContext } from './CartRoutes';
import { UserContext } from '../../index';
import { Elements } from '@stripe/react-stripe-js';
import { Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutPaymentForm from './CheckoutPaymentForm';
import http from "../../http";
import { validateUser } from '../../functions/user';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
                            product_price: item.Product.product_price,
                            product_sale: item.Product.product_sale,   
                            product_discounted_percent: item.Product.product_discounted_percent 
                        };
                    });
                    setItems(itemsData);
                    const selectedItemsDetails = itemsData.filter(item => selectedItems.includes(item.id));
                    const subtotal = selectedItemsDetails.reduce((sum, item) => {
                        let price = item.product_price;
                        console.log(item.product_sale);
                        if (item.product_sale) {
                            price = item.product_price * (1 - item.product_discounted_percent / 100);
                        }
                        return sum + (price * item.quantity);
                    }, 0);
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
                            enqueueSnackbar("Failed to create payment intent.", { variant: "error" });
                            navigate("/cart");
                            setLoading(false);
                        });
                })
                .catch((error) => {
                    enqueueSnackbar('Error fetching cart items:', { variant: "error" });
                    navigate("/cart");
                });
        }
    }, []);
    

    useEffect(() => {
        // Store selectedItems and total to localStorage when component is rendered
        const selectedItemsDetails = items.filter(item => selectedItems.includes(item.id));
        const total = getTotalPrice();
        localStorage.setItem('selectedItems', JSON.stringify(selectedItemsDetails));
        localStorage.setItem('total', total);
    }, []);


    const backToCart = () => {
        // Remove selectedItems and total from localStorage when user presses 'back to cart'
        localStorage.removeItem('selectedItems');
        localStorage.removeItem('total');
        navigate('/cart');
    };


    const getSubTotalPrice = () => {
        const selectedItemsDetails = items.filter(item => selectedItems.includes(item.id));
        return selectedItemsDetails.reduce((sum, item) => {
            let price = item.product_price;
            if (item.product_sale) {
                price = item.product_price * (1 - item.product_discounted_percent / 100);
            }
            return sum + (price * item.quantity);
        }, 0);
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
        localStorage.removeItem('selectedItems');
        localStorage.removeItem('total');

        await removeItemsFromCart();
        setClientSecret(null);
        navigate("/cart/checkout/success");

        // create order and order items after payment
        const selectedItemsDetails = items.filter(item => selectedItems.includes(item.id));
        const orderItems = selectedItemsDetails.map(item => {
            let price = item.product_price;
            if (item.product_sale) {
                price = item.product_price * (1 - item.product_discounted_percent / 100);
            }
            return {
                product_id: item.Product.id,
                quantity: item.quantity,
                total_price: item.product_price * item.quantity,
                discounted_total_price: price * item.quantity,
                discounted: item.product_sale,
            }
        });

        const subtotal = getSubTotalPrice();
        const gst = getGST();
        const total = getTotalPrice();
        const no_of_items = selectedItemsDetails.reduce((total, item) => total + item.quantity, 0);

        try {
            const res = await http.post("/cart/checkout/confirm", {
                order: {
                    user_id: user.id,
                    total_amount: total,
                    order_status: 1,
                    no_of_items: no_of_items,
                    subtotal_amount: subtotal,
                    gst_amount: gst,
                },
                orderItems
            });
            if (res.status !== 201) {
                enqueueSnackbar(`Failed to create order`, { variant: "error" });
            }
        } catch (error) {
            enqueueSnackbar(`Error creating order`, { variant: "error" });
            console.log(error)
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
            <Button LinkComponent={Link} variant="contained" color="primary" sx={{ marginBottom: "1rem" }} startIcon={<ArrowBackIcon />} to="/cart" onClick={backToCart}>Back</Button>
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