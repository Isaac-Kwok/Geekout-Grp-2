import React, { useEffect, useState } from 'react'
import { Box, Container, Typography } from '@mui/material'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import http from "../../../http";
import LoadingSkeleton from '../../../components/LoadingSkeleton';
import EditIcon from '@mui/icons-material/Edit';

const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'E-mail Address', flex: 1, minWidth: 200 },
    { field: 'phone_number', headerName: 'Phone Number', minWidth: 150 },
    { field: 'account_type', headerName: 'Role', minWidth: 100 },
    { field: 'is_active', headerName: 'Active?', type: 'boolean', minWidth: 100 },
    {
        field: 'actions', type: 'actions', width: 40, getActions: (params) => [
            <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit User"
            />,
        ]
    },
];

function ViewUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        http.get("/admin/users").then((res) => {
            if (res.status === 200) {
                setUsers(res.data)
                setLoading(false)
            }
        })
    }, [])
    return (
        <>
            <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
                <Typography variant="h3" sx={{ marginY: "2rem" }}>View Users</Typography>
                <DataGrid
                    rows={users}
                    columns={columns}
                    pageSize={10}
                    components={{
                        LoadingOverlay: LoadingSkeleton
                    }}
                    loading={loading}
                    autoHeight
                    getRowId={(row) => row.email}
                />

            </Container>
        </>
    )
}

export default ViewUsers