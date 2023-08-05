import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { Container, Grid, Paper, Typography, Button } from '@mui/material';
import http from '../../../http';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSnackbar } from 'notistack';
import VisibilityIcon from '@mui/icons-material/Visibility';

const RefundDetails = () => {
    const { id } = useParams();
    const [refund, setRefund] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();



    useEffect(() => {
        async function fetchRefund() {
            try {
                const response = await http.get("/admin/refunds/" + id);
                setRefund(response.data);
            } catch (error) {
                console.error('Error fetching refund:', error);
            }
        }

        fetchRefund();
    }, []);

    const handleApprove = async () => {
        try {
            const response = await http.put('/admin/refunds/' + id, { status: 7, refund_status: "Approved"});
            enqueueSnackbar('Refund approved successfully!', { variant: 'success' });
            navigate('/admin/refunds');
        } catch (error) {
            console.error('Error approving refund:', error);
            enqueueSnackbar('Error approving refund!', { variant: 'error' });
        }
    }
    
    const handleReject = async () => {
        try {
            const response = await http.put('/admin/refunds/' + id, { status: 1, refund_status: "Rejected"});
            enqueueSnackbar('Refund rejected successfully!', { variant: 'success' });
            navigate('/admin/refunds');
        } catch (error) {
            console.error('Error rejecting refund:', error);
            enqueueSnackbar('Error rejecting refund!', { variant: 'error' });
        }
    }
    


    if (!refund) {
        return 'Loading...';
    }

    return (
        <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
            <Typography variant="h3" fontWeight={700} sx={{ marginY: ["1rem", "1rem", "2rem"], fontSize: ["2rem", "2rem", "3rem"] }}>Refund Details</Typography>
            <Button LinkComponent={Link} variant="contained" color="primary" sx={{ marginBottom: "1rem" }} startIcon={<ArrowBackIcon />} to={`/admin/refunds`}>Back Button</Button>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ padding: 2 }}>
                        <Typography variant="h6">Refund Information</Typography>
                        <Typography variant="body1">Refund ID: {refund.id}</Typography>
                        <Typography variant="body1">For Order ID: {refund.order_id}</Typography>
                        <Typography variant="body1">Refund Reason: {refund.refund_reason}</Typography>
                        <Typography variant="body1">Created On: {new Date(refund.request_refund_date).toLocaleDateString()}</Typography>
                        <Button LinkComponent={Link} variant="contained" color="primary" sx={{ marginBottom: "1rem" }} startIcon={<VisibilityIcon />} to={`/admin/orders/${refund.order_id}`}>View Order</Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
                        <Typography variant="h6">Approve This Request?</Typography>
                        <Typography variant="body2">By approving this refund request, the customer order will be cancelled and an e-mail will be sent to the customer about the refund.</Typography>
                        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleApprove}>Approve Refund</Button>                    
                    </Paper>
                    <Paper elevation={2} sx={{ padding: 2 }}>
                        <Typography variant="h6">Reject This Request?</Typography>
                        <Typography variant="body2">By rejecting this refund request, the customer will be informed and the order will proceed as originally placed.</Typography>
                        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleReject}>Reject Refund</Button>                    
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default RefundDetails;
