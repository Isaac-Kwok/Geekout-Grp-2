import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Container, Typography, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import http from '../../../http';
import AdminPageTitle from '../../../components/AdminPageTitle'
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { useSnackbar } from 'notistack';



function EditOrderStatus() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState("");
    const delivery_status = {
        1: "Preparing",
        2: "Wait for delivery",
        3: "Delivered",
        4: "Received",
        5: "Cancelled",
        6: "Refunded",
    };
    const { enqueueSnackbar } = useSnackbar();


    useEffect(() => {
        async function fetchOrder() {
            try {
                const response = await http.get("/admin/orders/" + id);
                setOrder(response.data);
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        }
        fetchOrder();
    }, [id]);

    if (!order) {
        return 'Loading...';
    }

    const handleChange = (event) => {
        setStatus(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            const response = await http.put("/admin/orders/" + id, { status: Number(status) });
            setOrder(response.data);
            enqueueSnackbar('Order status successfully updated', { variant: 'success' });
            setStatus("");

            navigate("/admin/orders");
        } catch (error) {
            enqueueSnackbar('Error in updating order status', { variant: 'error' });
            console.error('Error updating status:', error);
        }
    };


    return (
        <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
            <AdminPageTitle title="Edit Order Status" subtitle={`Order ID: ${id}`} backbutton />
            <LoadingButton
                variant="contained"
                color="primary"
                type="submit"
                loading={loading}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                sx={{ marginBottom: "1rem" }}
            >
                Update Status
            </LoadingButton>

            <Paper sx={{ padding: "2rem", marginTop: "1rem" }}>
                <FormControl fullWidth>
                    <InputLabel id="status-select-label">Order Status</InputLabel>
                    <Select
                        labelId="status-select-label"
                        id="status-select"
                        value={status}
                        label="Order Status"
                        onChange={handleChange}
                    >
                        {Object.entries(delivery_status).map(([key, value]) => (
                            <MenuItem key={key} value={key}>{value}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Paper>
        </Container>
    );
}

export default EditOrderStatus;
