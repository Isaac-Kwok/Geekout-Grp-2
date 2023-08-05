import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Link } from 'react-router-dom';

const CheckoutSuccess = () => {
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
        </Box>
    );
}

export default CheckoutSuccess;
