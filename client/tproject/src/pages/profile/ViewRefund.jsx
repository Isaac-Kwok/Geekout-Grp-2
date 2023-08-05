import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography } from '@mui/material';
import http from '../../http';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
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
            navigate('/profile/orders/'+order.id);
            console.error('Error sending refund request:', error);
        }
    };

    if (!order) {
        return 'Loading...';
    }

    return (
        <Container maxWidth="sm">
            <Paper elevation={2} style={{ padding: '2rem', marginTop: '2rem' }}>
                <Typography variant="h4">Request a Refund</Typography>
                <Typography variant="body1">Name: {order.User.name}</Typography>
                <Typography variant="body1">Email: {order.User.email}</Typography>
                <Typography variant="body1">Order Id: {order.id}</Typography>

                <TextField
                    margin="normal"
                    fullWidth
                    id="refundReason"
                    label="Reason for Refund"
                    name="refundReason"
                    multiline
                    rows={4}
                    value={refundReason}
                    onChange={e => setRefundReason(e.target.value)}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleRefundRequest}
                >
                    Request Refund
                </Button>
            </Paper>
        </Container>
    );
};

export default RequestRefund;
