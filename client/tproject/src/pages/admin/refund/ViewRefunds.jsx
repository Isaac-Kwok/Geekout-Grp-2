import React, { useEffect, useState } from 'react'
import { Avatar, Stack, Card, CardContent, Container, Typography, Grid } from '@mui/material'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import http from "../../../http";
import LoadingSkeleton from '../../../components/LoadingSkeleton';
import EditIcon from '@mui/icons-material/Edit';
import AdminPageTitle from '../../../components/AdminPageTitle';
import { useTheme } from '@mui/material/styles';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddTaskIcon from '@mui/icons-material/AddTask';
import ClearIcon from '@mui/icons-material/Clear';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Tab, Box } from '@mui/material';

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

function ViewRefunds() {
    const [refunds, setRefunds] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const [sortModel, setSortModel] = useState([
        {
            field: "id",
            sort: "desc",
        },
    ]);
    const theme = useTheme();
    const totalRefunds = refunds.length;
    const pendingRefunds = refunds.filter(r => r.refund_status === "Pending").length;
    const acceptedRefunds = refunds.filter(r => r.refund_status === "Approved").length;
    const rejectedRefunds = refunds.filter(r => r.refund_status === "Rejected").length;
    const [tabValue, setTabValue] = useState("all");


    const filteredRefunds = (status) => {
        if (status === 'all') return refunds;
        return refunds.filter(r => r.refund_status === status);
    };




    const columns = [
        { field: 'id', headerName: 'Refund Number', minWidth: 150 },
        { field: 'refund_date', headerName: 'Refund Date & Time', minWidth: 200, valueFormatter: (params) => new Date(params.value).toLocaleString() },
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
            field: 'refund_status',
            headerName: 'Refund Status',
            minWidth: 200,
            valueGetter: (params) => {
                return params.row.refund_status;
            },
            renderCell: (params) => {
                if (params.value === "Pending") {
                    return <p style={{ color: theme.palette.error.main }}>{params.value}</p>;
                } else {
                    return <p>{params.value}</p>;
                }
            }
        },
        {
            field: 'actions', type: 'actions', width: 80, getActions: (params) => {
                // Check refund_status before displaying actions
                if (params.row.refund_status === "Approved" || params.row.refund_status === "Rejected") {
                    return []; 
                } else {
                    return [
                        <GridActionsCellItem
                            icon={<EditIcon />}
                            label="Edit Status"
                            onClick={() => {
                                navigate("/admin/refunds/editstatus/" + params.row.id);
                            }}
                            showInMenu
                        />,
                    ];
                }
            }
        }

    ];


    const handleGetRefunds = () => {
        http.get('/admin/refunds')
            .then((response) => {
                const refundsData = response.data.map(refund => ({
                    ...refund,
                    email: refund.User.email,
                    order_status: order_status[refund.Order.order_status]
                }));
                setRefunds(refundsData);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching refunds:', error);
            });
    }


    useEffect(() => {
        document.title = 'EnviroGo - View Refunds';
        handleGetRefunds()
    }, [])


    return (
        <>
            <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
                <AdminPageTitle title="View Refunds" />
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
                                            Total Refunds
                                        </Typography>
                                        <Typography variant="h4">
                                            {totalRefunds}

                                        </Typography>
                                    </Stack>
                                    <Avatar
                                        sx={{
                                            backgroundColor: 'secondary.main',
                                            height: 56,
                                            width: 56
                                        }}
                                    >
                                        <CurrencyExchangeIcon />
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
                                            Pending Refunds
                                        </Typography>
                                        <Typography variant="h4">
                                            {pendingRefunds}

                                        </Typography>
                                    </Stack>
                                    <Avatar
                                        sx={{
                                            backgroundColor: '#ffc107',
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
                                            Rejected Refunds
                                        </Typography>
                                        <Typography variant="h4">
                                            {rejectedRefunds}
                                        </Typography>
                                    </Stack>
                                    <Avatar
                                        sx={{
                                            backgroundColor: 'error.main',
                                            height: 56,
                                            width: 56
                                        }}
                                    >
                                        <ClearIcon />
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
                                            Accepted Refunds
                                        </Typography>
                                        <Typography variant="h4">
                                            {acceptedRefunds}
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
                <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                        <TabList onChange={(e, newVal) => setTabValue(newVal)} aria-label="Refund tabs">
                            <Tab label="All" value="all" />
                            <Tab label="Pending" value="Pending" />
                            <Tab label="Accepted" value="Approved" />
                            <Tab label="Rejected" value="Rejected" />
                        </TabList>
                    </Box>
                    <TabPanel value="all">
                        <DataGrid rows={refunds} columns={columns} pageSize={10} slots={{ LoadingOverlay: LoadingSkeleton }} sortModel={sortModel} onSortModelChange={(model) => setSortModel(model)} loading={loading} autoHeight getRowId={(row) => row.id} />
                    </TabPanel>
                    <TabPanel value="Pending">
                        <DataGrid rows={filteredRefunds('Pending')} columns={columns} pageSize={10} slots={{ LoadingOverlay: LoadingSkeleton }} sortModel={sortModel} onSortModelChange={(model) => setSortModel(model)} loading={loading} autoHeight getRowId={(row) => row.id} />
                    </TabPanel>
                    <TabPanel value="Approved">
                        <DataGrid rows={filteredRefunds('Approved')} columns={columns} pageSize={10} slots={{ LoadingOverlay: LoadingSkeleton }} sortModel={sortModel} onSortModelChange={(model) => setSortModel(model)} loading={loading} autoHeight getRowId={(row) => row.id} />
                    </TabPanel>
                    <TabPanel value="Rejected">
                        <DataGrid rows={filteredRefunds('Rejected')} columns={columns} pageSize={10} slots={{ LoadingOverlay: LoadingSkeleton }} sortModel={sortModel} onSortModelChange={(model) => setSortModel(model)} loading={loading} autoHeight getRowId={(row) => row.id} />
                    </TabPanel>
                </TabContext>
            </Container>
        </>

    )
}

export default ViewRefunds
