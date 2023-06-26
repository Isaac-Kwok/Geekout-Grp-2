import { useEffect, useState } from 'react'
import { Box, Card, CardContent, CardActions, Typography, Button, Stack, Grid, Divider, Chip } from '@mui/material'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import CardTitle from '../../components/CardTitle'
import HistoryIcon from '@mui/icons-material/History';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LabelIcon from '@mui/icons-material/Label';
import http from '../../http'

function ViewLogins() {

    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        {
            field: 'status', headerName: 'Payment Status',flex: 1, minWidth: 150, renderCell: (params) => {
                return <Chip variant="filled" size="small" icon={<LabelIcon />} label={params.value} color={params.value == "Pending" ? "warning" : "success"}  />;
            },
            
            type: 'singleSelect',
            valueOptions: ["Pending", "Succeeded"],
        },
        { field: 'type', headerName: 'Type', type: '', minWidth: 100 },
        { field: 'amount', headerName: 'Amount Paid ($)', type: 'string', minWidth: 150 },
        { field: 'createdAt', headerName: 'Created On', type: 'string', minWidth: 200 },
        {
            field: 'actions', type: 'actions', width: 40, getActions: (params) => [
                <GridActionsCellItem
                    icon={<VisibilityIcon />}
                    label="View Details"
                />
            ]
        },
    ];

    const getTransactions = async () => {
        const response = await http.get('/payment/history')
        setTransactions(response.data)
        setLoading(false)
    }

    useEffect(() => {
        document.title = "EnviroGo - Transaction History"
        getTransactions()
    }, [])

    return (
        <>
            <Card>
                <CardContent>
                    <CardTitle icon={<HistoryIcon />} title="Transaction History" />
                    <Box marginY={"1rem"}>
                        <DataGrid
                            rows={transactions}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            loading={loading}
                            autoHeight
                        />
                    </Box>
                </CardContent>
            </Card>
        </>
    )
}

export default ViewLogins