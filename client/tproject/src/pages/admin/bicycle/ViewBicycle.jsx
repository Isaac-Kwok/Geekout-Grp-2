import React, { useEffect, useState } from 'react'
import { Container, Typography, Chip, Button, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, fabClasses } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useNavigate, Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import http from "../../../http";

function ViewBicycle() {

    const [bicycle, setBicycle] = useState([])
    const [loading, setLoading] = useState(true)
    const [deactivateLoading, setDeactivateLoading] = useState(null)
    const [deleteBicycleDialog, setDeleteBicycleDialog] = useState(false)
    const [deleteBicycle, setDeleteBicycle] = useState(null)
    const navigate = useNavigate()

    const columns = [
        { field: "id", headerName: "ID", width: 200 },
        { field: "bicycle_lat", headerName: "Latitude", width: 200 },
        { field: "bicycle_lng", headerName: "Longitude", width: 200 },
        {
            field: 'actions', type: 'actions', width: 120, getActions: (params) => [
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
                />
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

    // const DeleteBicyclesButton = () => {
    //     const [open, setOpen] = useState(false);

    //     const handleDeleteClick = () => {
    //         // Perform delete operation
    //         console.log('Deleting all bicycles...');
    //         // Your delete operation code here
    //         http.delete("/bicycle").then((res) => {
    //             if (res.status === 200) {

    //             }
    //         }

    //         // Close the dialog
    //         setOpen(false);
    //     };
    // }

    useEffect(() => {
        document.title = "EnviroGo - View Bicycle"
        handleGetBicycle()
        
    }, [])

    return (
        <>
            <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
                <Typography variant="h3" fontWeight={700} sx={{ marginY: ["1rem", "1rem", "2rem"], fontSize: ["2rem", "2rem", "3rem"] }}>View Bicycles</Typography>
                <Button LinkComponent={Link} variant="contained" color="primary" sx={{ marginBottom: "1rem" }} to="/admin/bicycle/add">Add Bicycle</Button>
                {/* <Button LinkComponent={Link} variant="contained" color="secondary" sx={{ marginBottom: "1rem" }} onClick={() => setOpen(true)}>Delete All</Button> */}
                <DataGrid
                    rows={bicycle}
                    columns={columns}
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
            {/* <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete all bicycles?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteClick} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog> */}
        </>
    )
}

export default ViewBicycle