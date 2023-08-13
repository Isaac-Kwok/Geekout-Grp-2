import React, { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Box, Typography, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CartContext } from './CartRoutes';
import useUser from '../../context/useUser';
import http from '../../http';

const CheckoutSuccess = () => {
    const { selectedItems } = useContext(CartContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const { enqueueSnackbar } = useSnackbar();
    const [success, setSuccess] = useState(false);
    const { refreshUser } = useUser();

    const removeItemsFromCart = async () => {
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

                const selectedItemsDetails = itemsData.filter(item => selectedItems.includes(item.id));
                const itemIdsToRemove = selectedItemsDetails.map(item => item.id);
                try {
                    http.post("/cart/removeItems", { itemsToRemove: itemIdsToRemove }).then(res => {
                        if (res.status !== 200) {
                            enqueueSnackbar(`Failed to remove some items from cart`, { variant: "error" });
                        }
                    });
                } catch (error) {
                    enqueueSnackbar(`Error removing items from cart`, { variant: "error" });
                }
            })
            .catch((error) => {
                enqueueSnackbar(`Error getting items from cart`, { variant: "error" });
            });
    }

    useEffect(() => {
        // Check if order was successful
        // If successful, remove items from cart
        // If not, do nothing
        refreshUser();
        http.get("/orders/" + (searchParams.get("orderId"))).then(res => {
            if (res.status === 200) {
                if (res.data.order_status != "Pending" || searchParams.get("redirect_status") === "succeeded") {
                    setSuccess(true);
                    removeItemsFromCart();
                }
            }
        }).catch(err => {
            console.log(err);
            enqueueSnackbar(`Error checking order status`, { variant: "error" });
        });
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                gap: '20px'
            }}
        >
            {success && <>
                <CheckCircleOutlineIcon color="success" style={{ fontSize: 100 }} />
                <Typography variant="h3" component="div" gutterBottom>
                    Payment Completed
                </Typography>
                <Typography variant="h6" component="div" gutterBottom>
                    A receipt will be sent to your e-mail shortly.
                </Typography>
                <Button variant="outlined" color="primary" component={Link} to="/profile/orders">
                    View Order History
                </Button>
            </>}

            {!success && <>
                <CloseIcon color="error" style={{ fontSize: 100 }} />
                <Typography variant="h3" component="div" gutterBottom>
                    Payment Failed
                </Typography>
                <Typography variant="h6" component="div" gutterBottom>
                    Please retry payment.
                </Typography>
                <Button variant="outlined" color="primary" component={Link} to="/cart">
                    Review Cart
                </Button>
            </>}

        </Box>
    );
}

export default CheckoutSuccess;
