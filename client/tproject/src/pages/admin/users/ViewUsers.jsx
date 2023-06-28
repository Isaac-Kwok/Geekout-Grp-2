import React, { useEffect, useState } from 'react'
import { Container, Chip, Button, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import http from "../../../http";
import AdminPageTitle from '../../../components/AdminPageTitle';
import EditIcon from '@mui/icons-material/Edit';
import LabelIcon from '@mui/icons-material/Label';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

function getChipProps(params) {
    return {
        label: params.value,
    };
}

function ViewUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [deactivateLoading, setDeactivateLoading] = useState(null)
    const [deactivateUserDialog, setDeactivateUserDialog] = useState(false)
    const [deactivateUser, setDeactivateUser] = useState(null)
    const navigate = useNavigate()
    const columns = [
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'email', headerName: 'E-mail Address', flex: 1, minWidth: 250 },
        {
            field: 'phone_number', headerName: 'Phone Number', minWidth: 200, renderCell: (params) => {
                return params.value ? params.value : "Not Provided"
            }
        },
        {
            field: 'account_type', headerName: 'Role', minWidth: 200, renderCell: (params) => {
                return <Chip variant="filled" size="small" icon={<LabelIcon />} {...getChipProps(params)} />;
            },
            valueGetter: (params) => {
                const roles = ["Admin", "Customer", "Driver"]
                return roles[params.value]
            },
            type: 'singleSelect',
            valueOptions: ["Admin", "Customer", "Driver"],
        },
        { field: 'is_active', headerName: 'Active?', type: 'boolean', minWidth: 100 },
        {
            field: 'actions', type: 'actions', width: 120, getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit User"
                    onClick={() => {
                        navigate("/admin/users/" + params.row.id)
                    }}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Deactivate User"
                    onClick={() => {
                        setDeactivateUser(params.row)
                        handleDeactivateUserDialogOpen()
                    }}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<EmailIcon />}
                    label="Send E-mail"
                    href={"mailto:" + params.row.email}
                />,
                <GridActionsCellItem
                    icon={<PhoneIcon />}
                    label="Call"
                    href={"tel:" + params.row.phone_number}
                />
            ]
        },
    ];

    const handleDeactivateUserDialogClose = () => {
        setDeactivateUserDialog(false)
    }

    const handleDeactivateUserDialogOpen = () => {
        setDeactivateUserDialog(true)
    }

    const handleDeactivateUser = () => {
        setDeactivateLoading(true)
        http.put("/admin/users/" + deactivateUser.id, {is_active: false} ).then((res) => {
            if (res.status === 200) {
                setDeactivateLoading(false)
                setDeactivateUserDialog(false)
                handleGetUsers()
            }
        })
    }

    const handleGetUsers = () => {
        http.get("/admin/users").then((res) => {
            if (res.status === 200) {
                setUsers(res.data)
                setLoading(false)
            }
        })
    }

    useEffect(() => {
        document.title = "EnviroGo - View Users"
        handleGetUsers()
    }, [])
    return (
        <>
            <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
                <AdminPageTitle title="View Users" />
                <Button LinkComponent={Link} variant="contained" color="primary" sx={{ marginBottom: "1rem" }} startIcon={<PersonAddIcon />} to="/admin/users/create">Create User</Button>
                <DataGrid
                    rows={users}
                    columns={columns}
                    pageSize={10}
                    loading={loading}
                    autoHeight
                    getRowId={(row) => row.email}
                />
            </Container>
            <Dialog open={deactivateUserDialog} onClose={handleDeactivateUserDialogClose}>
                <DialogTitle>Deactivate User</DialogTitle>
                <DialogContent sx={{ paddingTop: 0 }}>
                    <DialogContentText>
                        Are you sure you want to deactivate this user?
                        <br />
                        User Details:
                        <ul>
                            <li>Name: {deactivateUser?.name}</li>
                            <li>E-mail Address: {deactivateUser?.email}</li>
                        </ul>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeactivateUserDialogClose} startIcon={<CloseIcon />}>Cancel</Button>
                    <LoadingButton type="submit" loadingPosition="start" loading={deactivateLoading} variant="text" color="error" startIcon={<DeleteIcon />} onClick={handleDeactivateUser}>Deactivate</LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ViewUsers