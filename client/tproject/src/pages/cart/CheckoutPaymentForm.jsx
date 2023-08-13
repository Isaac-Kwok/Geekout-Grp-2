import { useState, useEffect } from 'react'
import { useElements, PaymentElement, useStripe } from '@stripe/react-stripe-js'
import { DialogContent, DialogActions, Button, CardContent, CardActions, Card, Grid, Box, Typography, Divider } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import PaymentIcon from '@mui/icons-material/Payment';
import useUser from '../../context/useUser'
import InfoBox from '../../components/InfoBox'
import http from '../../http'

function CheckoutPaymentForm(props) {
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [remainingBalance, setRemainingBalance] = useState(0);
    const [remainingPoints, setRemainingPoints] = useState(0);
    const elements = useElements();
    const stripe = useStripe();
    const navigate = useNavigate();
    const { user, refreshUser } = useUser();


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: location.protocol + '//' + location.host + "/cart/checkout/success?orderId=" + props.orderId,
            },
            redirect: "if_required",
        }).then((result) => {
            console.log(result);
            if (result.error) {
                // Show error to your customer (e.g., insufficient funds)
                enqueueSnackbar(result.error.message, { variant: "error" });
            } else {
                // The payment has been processed!
                if (result.paymentIntent.status === "succeeded" || result.paymentIntent.status === "processing") {
                    // I set up the webhook on the backend to handle the topup, no action needed here
                    enqueueSnackbar("Payment is successful!", { variant: "success" });
                    navigate("/cart/checkout/success?orderId=" + props.orderId + "&redirect_status=succeeded");
                } else {
                    enqueueSnackbar("Payment is not successful!", { variant: "error" });
                }
            }
            setLoading(false);
        });
    }

    const handleWalletPayment = () => {
        setLoading(true)
        http.get("/payment/purchase/wallet/settle/" + props.orderId).then(res => {
            if (res.status === 200) {
                enqueueSnackbar("Payment is successful!", { variant: "success" });
                refreshUser()
                navigate("/cart/checkout/success?orderId=" + props.orderId);
            } else {
                enqueueSnackbar("Payment is not successful!", { variant: "error" });
            }
            setLoading(false)
        }).catch(err => {
            enqueueSnackbar("Payment is not successful!" + err.response.data.message, { variant: "error" });
            setLoading(false)
        })
    }

    const handlePointsPayment = () => {
        setLoading(true)
        http.get("/payment/purchase/point/settle/" + props.orderId).then(res => {
            if (res.status === 200) {
                enqueueSnackbar("Payment is successful!", { variant: "success" });
                refreshUser()
                navigate("/cart/checkout/success?orderId=" + props.orderId);
            } else {
                enqueueSnackbar("Payment is not successful!", { variant: "error" });
            }
            setLoading(false)
        }).catch(err => {
            enqueueSnackbar("Payment is not successful!" + err.response.data.message, { variant: "error" });
            setLoading(false)
        })
    }

    // Tabs with poppins font
    const paymentElementOptions = {
        layout: "tabs",
    }


    useEffect(() => {
        if (user) {
            setRemainingBalance((user.cash - props.total).toFixed(2))
            setRemainingPoints((user.points - (props.total * 100)).toFixed())
        }
    }, [user, props.total])

    return (
        <>
            {props.paymentMethod === "Stripe" &&
                <form id="payment-form" onSubmit={handleSubmit}>
                    <CardContent>
                        <PaymentElement options={paymentElementOptions} />
                    </CardContent>
                    <CardActions>
                        <LoadingButton startIcon={<PaymentIcon />} variant='contained' id='submit' type="submit" loadingPosition="start" loading={loading} color="primary" sx={{ width: "100%" }}>Pay</LoadingButton>
                    </CardActions>
                </form>
            }
            {props.paymentMethod === "Wallet" &&
                <>
                    <CardContent>
                        <Grid container alignItems={"center"}>
                            <Grid item xs={12} sm marginBottom={["1rem", 0]}>
                                <Box display="flex" alignItems={"center"}>
                                    <InfoBox flexGrow={1} title="Wallet Balance" value={<Typography variant='h5' fontWeight={700}>${user?.cash}</Typography>} />
                                </Box>
                            </Grid>
                            <Divider orientation="vertical" sx={{ marginX: "1rem" }} flexItem />
                            <Grid item xs={12} sm>
                                <Box display="flex" alignItems={"center"}>
                                    <InfoBox flexGrow={1} title="After Payment" value={<Typography variant='h5' fontWeight={700}>${remainingBalance}</Typography>} />
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <LoadingButton onClick={handleWalletPayment} disabled={remainingBalance < 0} startIcon={<PaymentIcon />} variant='contained' loadingPosition="start" loading={loading} color="primary" sx={{ width: "100%" }}>Pay</LoadingButton>
                    </CardActions>
                </>

            }

            {props.paymentMethod === "Point" &&
                <>
                    <CardContent>
                        <Grid container alignItems={"center"}>
                            <Grid item xs={12} sm marginBottom={["1rem", 0]}>
                                <Box display="flex" alignItems={"center"}>
                                    <InfoBox flexGrow={1} title="GreenMiles Balance" value={<Typography variant='h5' fontWeight={700}>{user?.points} GM</Typography>} />
                                </Box>
                            </Grid>
                            <Divider orientation="vertical" sx={{ marginX: "1rem" }} flexItem />
                            <Grid item xs={12} sm>
                                <Box display="flex" alignItems={"center"}>
                                    <InfoBox flexGrow={1} title="After Payment" value={<Typography variant='h5' fontWeight={700}>{remainingPoints} GM</Typography>} />
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <LoadingButton onClick={handlePointsPayment} disabled={remainingPoints < 0} startIcon={<PaymentIcon />} variant='contained' loadingPosition="start" loading={loading} color="primary" sx={{ width: "100%" }}>Pay</LoadingButton>
                    </CardActions>
                </>

            }

        </>
    )
}

export default CheckoutPaymentForm
