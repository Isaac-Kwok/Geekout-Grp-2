import React, { useEffect, useState } from 'react'
import { Container, Typography, Chip, Button, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions } from '@mui/material'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import http from "../../../http";
import LoadingSkeleton from '../../../components/LoadingSkeleton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AdminPageTitle from '../../../components/AdminPageTitle';
import { useTheme } from '@mui/material/styles';

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
                    return <p style={{color: theme.palette.error.main}}>{params.row.order_status}</p>;
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
                    return <p style={{color: theme.palette.error.main}}>{params.value}</p>;
                } else {
                    return <p>{params.value}</p>;
                }
            }
        },                        
        {
            field: 'actions', type: 'actions', width: 80, getActions: (params) => {
                // Check refund_status before displaying actions
                if(params.row.refund_status === "Approved" || params.row.refund_status === "Rejected") {
                    // Return empty array or null if refund_status is approve or reject
                    return []; // Or return [];
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
                <DataGrid
                    rows={refunds}
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

export default ViewRefunds
