import React, { useState, useEffect, useContext } from 'react';
import { DialogContent, Grid, Paper, Divider, Container, Typography, CircularProgress, List, ListItem, ListItemText, Button, Card, CardContent } from '@mui/material';
import { useSnackbar } from 'notistack';
import { CartContext } from './CartRoutes';
import { UserContext } from '../../index';
import { Elements } from '@stripe/react-stripe-js';
import { Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckoutPaymentForm from './CheckoutPaymentForm';
import http from "../../http";
import { validateUser } from '../../functions/user';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageTitle from '../../components/PageTitle';
import CardTitle from '../../components/CardTitle';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Checkout = () => {
    const { user } = useContext(UserContext);
    const [items, setItems] = useState([]);
    const { selectedItems } = useContext(CartContext);
    const [loading, setLoading] = useState(true);
    const [clientSecret, setClientSecret] = useState("");
    const [order_id, setorder_id] = useState("");
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
                    const no_of_items = selectedItemsDetails.reduce((total, item) => total + item.quantity, 0);
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

                    if (no_of_items === 0) {
                        enqueueSnackbar("You have no items in your cart", { variant: "error" });
                        return navigate("/cart");
                    }

                    http.post("/cart/checkout/confirm", {
                        order: {
                            user_id: user.id,
                            total_amount: total,
                            order_status: 0,
                            no_of_items: no_of_items,
                            subtotal_amount: subtotal,
                            gst_amount: gst,
                        },
                        orderItems
                    }).then((res) => {
                        const orderId = res.data.orderId;
                        setorder_id(orderId);
                        http.post("/payment/purchase/stripe", { amount: total, order_id: orderId })
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
                    }).catch((err) => {
                        enqueueSnackbar("Failed to create order.", { variant: "error" });
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


    if (loading || !clientSecret) {
        return (
            <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Container>
        )
    }

    return (
        <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
            <PageTitle title="Checkout" subtitle="Review Purchase" />
            <Button LinkComponent={Link} variant="outlined" color="primary" sx={{ marginBottom: "1rem" }} startIcon={<ArrowBackIcon />} to="/cart" onClick={backToCart}>Back</Button>
            <Grid container spacing={2} flexDirection={{ xs: "row-reverse", md: "row" }}>
                <Grid item xs={12} md={9}>
                    <Card>
                        <CardContent>
                            <CardTitle title="Payment Details" icon={<PaymentIcon />} />
                        </CardContent>
                        <Elements stripe={stripePromise} options={{ clientSecret: clientSecret }}>
                            <CheckoutPaymentForm orderId={order_id} />
                        </Elements>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <CardTitle title="Order Summary" icon={<RequestQuoteIcon />} />
                        </CardContent>

                        <List>
                            <ListItem>
                                <ListItemText primary="Subtotal" />
                                <Typography variant="h6">${getSubTotalPrice().toFixed(2)}</Typography>
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
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Checkout;