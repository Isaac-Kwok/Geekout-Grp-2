import React, { useEffect, useState } from 'react'
import { Box, Avatar, Stack, Card, CardContent, Container, Typography, Grid, Tabs, Tab, useMediaQuery } from '@mui/material'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import http from "../../../http";
import LoadingSkeleton from '../../../components/LoadingSkeleton';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AdminPageTitle from '../../../components/AdminPageTitle';
import { useTheme } from '@mui/material/styles';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddTaskIcon from '@mui/icons-material/AddTask';
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";


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
    const theme = useTheme();
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [pendingOrders, setPendingOrders] = useState(0);
    const [completedOrders, setCompletedOrders] = useState(0);
    const [tabValue, setTabValue] = useState("all");
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const filteredOrders = () => {
        if (tabValue === 'all') return orders;
        return orders.filter(order => order.order_status === order_status[tabValue]);
    };

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
        {
            field: 'order_status',
            headerName: 'Status',
            minWidth: 200,
            valueGetter: (params) => {
                return params.row.order_status;
            },
            renderCell: (params) => {
                const statusText = params.row.order_status;
                if (statusText === "Preparing" || statusText === "Refund Processing") {
                    return <p style={{ color: theme.palette.error.main }}>{params.row.order_status}</p>;
                } else {
                    return <p>{params.row.order_status}</p>;
                }
            }
        },
        {
            field: 'total_amount',
            headerName: 'Total Price ($)',
            headerAlign: 'left',
            minWidth: 150,
            valueGetter: (params) => {
                return params.row.order_payment_method === "Points" ? '-' : `${params.row.total_amount}`;
            }
        },
        {
            field: 'payment_method_check',
            headerName: 'Points Used',
            headerAlign: 'left',
            minWidth: 150,
            valueGetter: (params) => {
                return params.row.order_payment_method === "Points" ? params.row.points_used : '-';
            }
        },
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
                setTotalOrders(ordersData.length);
                const total = ordersData.reduce((acc, curr) => acc + (curr.order_payment_method !== "Points" ? parseFloat(curr.total_amount) : 0), 0);
                const totalSales = total.toFixed(2);
                setTotalSales(totalSales);
                setPendingOrders(ordersData.filter(order => order.order_status !== "Received").length);
                setCompletedOrders(ordersData.filter(order => order.order_status === "Received").length);
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
                <Grid container spacing={2} sx={{ marginBottom: "1.5em" }}>
                    <Grid item xs={12} xl={3} md={6} sm={6}>
                        <Card>
                            <CardContent>
                                <Stack
                                    alignItems="flex-start"
                                    direction="row"
                                    justifyContent="space-between"
                                    spacing={3}
                                >
                                    <Stack spacing={1}>
                                        <Typography
                                            color="text.secondary"
                                            variant="h6"
                                        >
                                            Total Orders
                                        </Typography>
                                        <Typography variant="h4">
                                            {totalOrders}

                                        </Typography>
                                    </Stack>
                                    <Avatar
                                        sx={{
                                            backgroundColor: 'secondary.main',
                                            height: 56,
                                            width: 56
                                        }}
                                    >
                                        <ReceiptLongIcon />
                                    </Avatar>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} xl={3} md={6} sm={6}>
                        <Card>
                            <CardContent>
                                <Stack
                                    alignItems="flex-start"
                                    direction="row"
                                    justifyContent="space-between"
                                    spacing={3}
                                >
                                    <Stack spacing={1}>
                                        <Typography
                                            color="text.secondary"
                                            variant="h6"
                                        >
                                            Total Sales
                                        </Typography>
                                        <Typography variant="h4">
                                            {totalSales}
                                        </Typography>
                                    </Stack>
                                    <Avatar
                                        sx={{
                                            backgroundColor: '#ffc107',
                                            height: 56,
                                            width: 56
                                        }}
                                    >
                                        <AttachMoneyIcon />
                                    </Avatar>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} xl={3} md={6} sm={6}>
                        <Card>
                            <CardContent>
                                <Stack
                                    alignItems="flex-start"
                                    direction="row"
                                    justifyContent="space-between"
                                    spacing={3}
                                >
                                    <Stack spacing={1}>
                                        <Typography
                                            color="text.secondary"
                                            variant="h6"
                                        >
                                            Pending Orders
                                        </Typography>
                                        <Typography variant="h4">
                                            {pendingOrders}
                                        </Typography>
                                    </Stack>
                                    <Avatar
                                        sx={{
                                            backgroundColor: 'error.main',
                                            height: 56,
                                            width: 56
                                        }}
                                    >
                                        <MoreHorizIcon />
                                    </Avatar>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} xl={3} md={6} sm={6}>
                        <Card>
                            <CardContent>
                                <Stack
                                    alignItems="flex-start"
                                    direction="row"
                                    justifyContent="space-between"
                                    spacing={3}
                                >
                                    <Stack spacing={1}>
                                        <Typography
                                            color="text.secondary"
                                            variant="h6"
                                        >
                                            Completed Orders
                                        </Typography>
                                        <Typography variant="h4">
                                            {completedOrders}
                                        </Typography>
                                    </Stack>
                                    <Avatar
                                        sx={{
                                            backgroundColor: 'success.main',
                                            height: 56,
                                            width: 56
                                        }}
                                    >
                                        <AddTaskIcon />
                                    </Avatar>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <TabContext value={String(tabValue)}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                        <Tabs
                            value={tabValue}
                            onChange={(e, newVal) => setTabValue(newVal)}
                            variant="scrollable"
                            allowScrollButtonsMobile
                            aria-label="scrollable force tabs example"
                            indicatorColor="primary"
                            textColor="primary"
                        >
                            <Tab label="All" value="all" />
                            <Tab label="Preparing" value="1" />
                            <Tab label="Wait for delivery" value="2" />
                            <Tab label="Delivered" value="3" />
                            <Tab label="Received" value="4" />
                            <Tab label="Cancelled" value="5" />
                        </Tabs>
                    </Box>
                    <TabPanel value="all" sx={{p: 0, mt: "1rem"}}>
                        <DataGrid rows={orders} columns={columns} pageSize={10} slots={{ LoadingOverlay: LoadingSkeleton }} sortModel={sortModel} onSortModelChange={(model) => setSortModel(model)} loading={loading} autoHeight getRowId={(row) => row.id} />
                    </TabPanel>

                    <TabPanel value="1" sx={{p: 0, mt: "1rem"}}>
                        <DataGrid rows={filteredOrders()} columns={columns} pageSize={10} slots={{ LoadingOverlay: LoadingSkeleton }} sortModel={sortModel} onSortModelChange={(model) => setSortModel(model)} loading={loading} autoHeight getRowId={(row) => row.id} />
                    </TabPanel>

                    <TabPanel value="2" sx={{p: 0, mt: "1rem"}}>
                        <DataGrid rows={filteredOrders()} columns={columns} pageSize={10} slots={{ LoadingOverlay: LoadingSkeleton }} sortModel={sortModel} onSortModelChange={(model) => setSortModel(model)} loading={loading} autoHeight getRowId={(row) => row.id} />
                    </TabPanel>

                    <TabPanel value="3" sx={{p: 0, mt: "1rem"}}>
                        <DataGrid rows={filteredOrders()} columns={columns} pageSize={10} slots={{ LoadingOverlay: LoadingSkeleton }} sortModel={sortModel} onSortModelChange={(model) => setSortModel(model)} loading={loading} autoHeight getRowId={(row) => row.id} />
                    </TabPanel>

                    <TabPanel value="4" sx={{p: 0, mt: "1rem"}}>
                        <DataGrid rows={filteredOrders()} columns={columns} pageSize={10} slots={{ LoadingOverlay: LoadingSkeleton }} sortModel={sortModel} onSortModelChange={(model) => setSortModel(model)} loading={loading} autoHeight getRowId={(row) => row.id} />
                    </TabPanel>

                    <TabPanel value="5" sx={{p: 0, mt: "1rem"}}>
                        <DataGrid rows={filteredOrders()} columns={columns} pageSize={10} slots={{ LoadingOverlay: LoadingSkeleton }} sortModel={sortModel} onSortModelChange={(model) => setSortModel(model)} loading={loading} autoHeight getRowId={(row) => row.id} />
                    </TabPanel>
                </TabContext>
            </Container>
        </>

    )
}

export default ViewOrders