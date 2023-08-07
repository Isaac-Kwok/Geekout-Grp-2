import { useState } from 'react'
import { useElements, PaymentElement, useStripe } from '@stripe/react-stripe-js'
import { DialogContent, DialogActions, Button, CardContent, CardActions } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import PaymentIcon from '@mui/icons-material/Payment';

function CheckoutPaymentForm(props) {
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const elements = useElements();
    const stripe = useStripe();
    const navigate = useNavigate();


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
                    navigate("/cart/checkout/success?orderId=" + props.orderId);
                } else {
                    enqueueSnackbar("Payment is not successful!", { variant: "error" });
                }
            }
            setLoading(false);
        });
    }

    const paymentElementOptions = {
        layout: "tabs"
    }

    return (
        <>
            <form id="payment-form" onSubmit={handleSubmit}>
                <CardContent>
                    <PaymentElement options={paymentElementOptions} />
                </CardContent>
                <CardActions>
                    <LoadingButton startIcon={<PaymentIcon/>} variant='contained' id='submit' type="submit" loadingPosition="start" loading={loading} color="primary" sx={{width: "100%"}}>Pay</LoadingButton>
                </CardActions>

            </form>
        </>
    )
}

export default CheckoutPaymentForm
