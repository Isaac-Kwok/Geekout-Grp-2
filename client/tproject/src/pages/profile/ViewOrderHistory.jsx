import { useEffect, useState } from 'react'
import { Box, Card, CardContent, Chip } from '@mui/material'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import CardTitle from '../../components/CardTitle'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LabelIcon from '@mui/icons-material/Label';
import http from '../../http'
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

function ViewLogins() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [columns, setColumns] = useState([]);
    const navigate = useNavigate()

    const baseColumns  = [
        { field: 'id', headerName: 'ID', width: 100, type: 'number' },
        {
            field: 'order_status',
            headerName: 'Order Status',
            flex: 1,
            minWidth: 150,
            
        },
        { 
            field: 'total_amount', 
            headerName: 'Total Price ($)', 
            minWidth: 150,
            valueGetter: (params) => {
                return params.row.order_payment_method === "Points" ? '-' : params.row.total_amount;
            }
        },
        { 
            field: 'payment_method_check',
            headerName: 'Points Used',
            minWidth: 150,
            valueGetter: (params) => {
                return params.row.order_payment_method === "Points" ? params.row.points_used : '-';
            }
        },
        { field: 'createdAt', headerName: 'Created On', type: 'dateTime', minWidth: 200, valueFormatter: (params) => new Date(params.value).toLocaleString() },
        {
            field: 'actions', type: 'actions', width: 40, getActions: (params) => [
                <GridActionsCellItem
                    icon={<VisibilityIcon />}
                    label="View Details"
                    onClick={() => {
                        navigate("/profile/orders/" + params.row.id)
                    }}
                />
            ]
        },
    ];

    const getOrders = () => {
        http.get('/orders/')
            .then((response) => {
                const ordersData = response.data.map(order => ({
                    ...order,
                    order_status: order_status[order.order_status],
                    refund_status: order.Refund ? order.Refund.refund_status : '-'
                }));
                if (ordersData.some(order => order.refund_status && order.refund_status !== '-')) {
                    const updatedColumns = [...baseColumns];
                    // Inserting the refund_status column right after the order_status column
                    updatedColumns.splice(2, 0, {
                        field: 'refund_status',
                        headerName: 'Refund Status',
                        flex: 1,
                        minWidth: 150,
                        valueFormatter: (params) => {
                            return params.value || '-';
                        }
                    });
                    setColumns(updatedColumns);
                } else {
                    setColumns(baseColumns);
                }

                setOrders(ordersData);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching orders:', error);
                setLoading(false);
            });
    }

    useEffect(() => {
        document.title = "EnviroGo - Order History"
        getOrders()
    }, [])

    return (
        <>
            <Card>
                <CardContent>
                    <CardTitle icon={<ReceiptLongIcon />} title="Order History" />
                    <Box marginY={"1rem"}>
                        <DataGrid
                            rows={orders}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            loading={loading}
                            sortModel={[
                                {
                                  field: "id",
                                  sort: "desc",
                                },
                              ]}
                            autoHeight
                        />
                    </Box>
                </CardContent>
            </Card>
        </>
    )
}

export default ViewLogins
