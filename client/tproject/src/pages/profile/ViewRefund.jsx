import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Divider, Box, Card, CardContent, Stack } from '@mui/material';
import http from '../../http';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { CurrencyExchange } from '@mui/icons-material';
import CardTitle from '../../components/CardTitle';
import InfoBox from '../../components/InfoBox';
const order_status = {
    1: "Preparing",
    2: "Wait for delivery",
    3: "Delivered",
    4: "Received",
    5: "Cancelled",
    6: "Refund Processing",
    7: "Refund Approved",
    8: "Refund Denied"
};

const RequestRefund = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const navigate = useNavigate();
    const [refundReason, setRefundReason] = useState("");
    const { enqueueSnackbar } = useSnackbar();


    useEffect(() => {
        async function fetchOrder() {
            try {
                const response = await http.get("/orders/refunds/" + id);
                setOrder(response.data);
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        }

        fetchOrder();
    }, []);

    const handleRefundRequest = async () => {
        try {
            const response = await http.post('/refunds', {
                order_id: order.id,
                refund_reason: refundReason,
                refund_amount: order.total_amount
            });
            enqueueSnackbar('Refund successfully created', { variant: 'success' });
            navigate('/profile/orders');
        } catch (error) {
            enqueueSnackbar('Error in creating refund', { variant: 'error' });
            navigate('/profile/orders/' + order.id);
            console.error('Error sending refund request:', error);
        }
    };

    if (!order) {
        return 'Loading...';
    }

    return (
        <Card>
            <CardContent>
                <CardTitle title="Request a Refund" icon={<CurrencyExchange />} back={"/profile/orders/" + id} />
                <Box>
                    <Typography variant="h6" color="textSecondary" mt={"1rem"}>
                        Order Details:
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{xs: 2, sm: 4}}>
                        <InfoBox title="Name" value={order.User.name} />
                        <InfoBox title="Email" value={order.User.email} />
                        <InfoBox title="Order ID" value={order.id} />
                    </Stack>

                    <Divider style={{ marginBottom: '1rem', marginTop: '1rem' }} />

                    <Typography variant="h6" color="textSecondary">
                        Refund Reason:
                    </Typography>

                    <TextField
                        margin="normal"
                        fullWidth
                        id="refundReason"
                        label="Describe your reason"
                        name="refundReason"
                        multiline
                        rows={4}
                        value={refundReason}
                        onChange={e => setRefundReason(e.target.value)}
                        variant="outlined"
                    />

                    <Box mt={3}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleRefundRequest}
                        >
                            Request Refund
                        </Button>
                    </Box>
                </Box>

            </CardContent>
        </Card>
    );
};

export default RequestRefund;
