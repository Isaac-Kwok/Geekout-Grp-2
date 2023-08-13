import React, { useEffect, useState } from 'react'
import { Container, Typography, Chip, Button, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions } from '@mui/material'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import http from "../../../http";
import LoadingSkeleton from '../../../components/LoadingSkeleton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AdminPageTitle from '../../../components/AdminPageTitle';

function formatDateToCustomFormat(dateTimeStr) {
    const date = new Date(dateTimeStr);

    // Convert to UTC+8 timezone
    date.setUTCHours(date.getUTCHours() + 8);

    // Format the date into "yyyy-MM-dd" format
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Format the time into "hh:mm:ss AM/PM" format
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedTime = `${hours}:${minutes}:${seconds} ${amPm}`;

    return `${formattedDate} ${formattedTime}`;
}

function ViewOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
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
    const [sortModel, setSortModel] = useState([
        {
            field: "id",
            sort: "desc",
        },
    ]);

    const columns = [
        { field: 'id', headerName: 'Order Number', minWidth: 150 },
        { field: 'order_date', headerName: 'Order Date & Time', minWidth: 200 },
        { field: 'email', headerName: 'Email', width: 300 },
        { field: 'order_status', headerName: 'Status', minWidth: 200 },
        { field: 'no_of_items', headerName: 'No of Items', minWidth: 200 },
        {
            field: 'actions', type: 'actions', width: 80, getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit Status"
                    onClick={() => {
                        navigate("/admin/orders/editstatus/" + params.row.id);
                    }}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<VisibilityIcon />}
                    label="View Order"
                    onClick={() => {
                        navigate("/admin/orders/" + params.row.id);
                    }}
                    showInMenu
                />
            ]
        },
    ];


    const handleGetOrder = () => {
        http.get('/admin/orders')
            .then((response) => {
                const ordersData = response.data.map(order => ({
                    ...order,
                    email: order.User.email,
                    order_date: formatDateToCustomFormat(order.order_date),
                    order_status: order_status[order.order_status]
                }));
                setOrders(ordersData);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching orders:', error);
            });
    }


    useEffect(() => {
        document.title = 'EnviroGo - View Orders';
        handleGetOrder()
    }, [])


    return (
        <>
            <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
                <AdminPageTitle title="View Orders" />
                <DataGrid
                    rows={orders}
                    columns={columns}
                    pageSize={10}
                    slots={{
                        LoadingOverlay: LoadingSkeleton
                    }}
                    sortModel={sortModel}
                    onSortModelChange={(model) => setSortModel(model)}
                    loading={loading}
                    autoHeight
                    getRowId={(row) => row.id}
                />
            </Container>
        </>

    )
}

export default ViewOrders