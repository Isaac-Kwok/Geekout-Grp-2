import React, { useEffect, useState } from 'react'
import { Box, Container, Typography, Chip, Button } from '@mui/material'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import http from "../../../http";
import LoadingSkeleton from '../../../components/LoadingSkeleton';
import EditIcon from '@mui/icons-material/Edit';
import LabelIcon from '@mui/icons-material/Label';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

function getChipProps(params) {
    const roles = ["Admin", "Customer", "Driver"]

    return {
        label: roles[params.value],
    };
}

const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'E-mail Address', flex: 1, minWidth: 250 },
    { field: 'phone_number', headerName: 'Phone Number', minWidth: 200, renderCell: (params) => {
        return params.value ? params.value : "Not Provided"
    }},
    {
        field: 'account_type', headerName: 'Role', minWidth: 200, renderCell: (params) => {
            return <Chip variant="filled" size="small" icon={<LabelIcon/>} {...getChipProps(params)} />;
        }
    },
    { field: 'is_active', headerName: 'Active?', type: 'boolean', minWidth: 100 },
    {
        field: 'actions', type: 'actions', width: 80, getActions: (params) => [
            <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit User"
            />,
            <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Deactivate User"
            />,
        ]
    },
];

function ViewUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        document.title = "EnviroGo - View Users"
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
                <Typography variant="h3" fontWeight={700} sx={{ marginY: ["1rem", "1rem", "2rem"], fontSize: ["2rem", "2rem", "3rem"] }}>View Users</Typography>
                <Button variant="contained" color="primary" sx={{ marginBottom: "1rem" }} startIcon={<PersonAddIcon />}>Create User</Button>
                <DataGrid
                    rows={users}
                    columns={columns}
                    pageSize={10}
                    slots={{
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