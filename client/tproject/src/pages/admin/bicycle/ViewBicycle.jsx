import React, { useEffect, useState } from 'react'
import { Container, Typography, Chip, Button, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, fabClasses } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { DataGrid, GridActionsCellItem, GridToolbarExport } from '@mui/x-data-grid';
import { useNavigate, Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import http from "../../../http";
import AdminPageTitle from '../../../components/AdminPageTitle';
import { Visibility } from '@mui/icons-material';

function ViewBicycle() {

    const [bicycle, setBicycle] = useState([])
    const [loading, setLoading] = useState(true)
    const [deactivateLoading, setDeactivateLoading] = useState(null)
    const [deleteBicycleDialog, setDeleteBicycleDialog] = useState(false)
    const [deleteBicycle, setDeleteBicycle] = useState(null)
    const navigate = useNavigate()

    const columns = [
        { field: "id", headerName: "ID", minWidth: 200 },
        { field: "bicycle_lat", headerName: "Latitude", minWidth: 50, flex: 1 },
        { field: "bicycle_lng", headerName: "Longitude", minWidth: 50, flex: 1 },
        {
            field: 'location', headerName: 'Location', minWidth: 200,
            renderCell: (params) => params.row.bicycle_lat || "Loading...",
        },
        {
            field: 'actions', type: 'actions', width: 80, getActions: (params) => [
                <GridActionsCellItem
                    icon={<Visibility />}
                    label="View Bicycle Details"
                    onClick={() => {
                        navigate("/admin/bicycle/details/" + params.row.id)
                    }}
                />,
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit Bicycle"
                    onClick={() => {
                        navigate("/admin/bicycle/" + params.row.id)
                    }}
                    showInMenu
                />
                ,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete Bicycle"
                    onClick={() => {
                        setDeleteBicycle(params.row)
                        handleDeleteBicycleDialogOpen()
                    }}
                    showInMenu
                />,
                
            ]
        },

    ];

    const handleGetBicycle = () => {
        http.get("/bicycle").then((res) => {
            if (res.status === 200) {
                setBicycle(res.data)
                setLoading(false)
            }
        })
    }

    const handleDeleteBicycleDialogClose = () => {
        setDeleteBicycleDialog(false)
    }

    const handleDeleteBicycleDialogOpen = () => {
        setDeleteBicycleDialog(true)
    }

    const handleDeleteBicycle = () => {
        setDeactivateLoading(true)
        http.delete("/bicycle/" + deleteBicycle.id).then((res) => {
            if (res.status === 200) {
                setDeactivateLoading(false)
                setDeleteBicycleDialog(false)
                handleGetBicycle()
            }
        })
    }

    const customToolbar = () => {
        return (
            <GridToolbarExport />
        );
    }

    useEffect(() => {
        document.title = "EnviroGo - View Bicycle"
        handleGetBicycle()

    }, [])

    return (
        <>
            <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
                <AdminPageTitle title="View Bicycles" backbutton />
                <Button LinkComponent={Link} variant="contained" color="primary" sx={{ marginBottom: "1rem" }} to="/admin/bicycle/add">Add Bicycle</Button>
                <DataGrid
                    rows={bicycle}
                    columns={columns}
                    autoHeight
                    loading={loading}
                    slots={{ toolbar: customToolbar }}
                />
            </Container>
            <Dialog open={deleteBicycleDialog} onClose={handleDeleteBicycleDialogClose}>
                <DialogTitle>Delete Bicycle</DialogTitle>
                <DialogContent sx={{ paddingTop: 0 }}>
                    <DialogContentText>
                        Are you sure you want to delete this bicycle?
                        <br />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteBicycleDialogClose} startIcon={<CloseIcon />}>Cancel</Button>
                    <LoadingButton type="submit" loadingPosition="start" loading={deactivateLoading} variant="text" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteBicycle}>Delete</LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ViewBicycle