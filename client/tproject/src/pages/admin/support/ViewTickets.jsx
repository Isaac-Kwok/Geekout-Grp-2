import React, { useState, useEffect } from 'react'
import { Container, Chip, Dialog, DialogActions, DialogContentText, DialogContent, DialogTitle, Button } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import { Link, useNavigate } from 'react-router-dom'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import http from '../../../http'
import { useSnackbar } from 'notistack';
import AdminPageTitle from '../../../components/AdminPageTitle';

function ViewTickets() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState([]);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteDialogData, setDeleteDialogData] = useState({});
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const columns = [
        { field: 'title', headerName: 'Help Query', minWidth: 300, flex: 1 },
        {
            field: 'status', headerName: 'Ticket Status', minWidth: 200, renderCell: (params) => {
                return <Chip variant="filled" size="small" icon={params.value == "Closed" ? <DoneIcon/> : <CloseIcon/>} label={params.value} color={params.value == "Closed" ? "success" : "error"}  />;
            },
            valueGetter: (params) => {
                return params.value
            },
            type: 'singleSelect',
            valueOptions: ['Open', 'Closed'],
        },
        { field: 'createdAt', headerName: 'Created On', minWidth: 250, valueGetter: ({ value }) => value && new Date(value), type: 'dateTime', },
        {
            field: 'actions', type: 'actions', width: 80, getActions: (params) => [
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Close Ticket"
                    onClick={() => {
                        setDeleteDialog(true)
                        setDeleteDialogData(params.row)
                    }}
                />,
                <GridActionsCellItem
                    icon={<VisibilityIcon />}
                    label="View Ticket"
                    onClick={() => {
                        navigate("/admin/support/ticket/" + params.row.id)
                    }}
                />,
            ]
        },
    ];

    const getTickets = async () => {
        setLoading(true)
        http.get('/admin/support/ticket')
            .then((response) => {
                setTickets(response.data)
                setLoading(false)
            })
            .catch((error) => {
                enqueueSnackbar("Error getting help tickets. " + error.response.data.message, { variant: "error" });
                setLoading(false)
            })
    }

    const handleCloseTicket = () => {
        setDeleteLoading(true)
        http.delete('/admin/support/ticket/' + deleteDialogData.id)
            .then((response) => {
                setDeleteLoading(false)
                setDeleteDialog(false)
                getTickets()
                enqueueSnackbar("Help ticket closed successfully.", { variant: "success" });
            })
            .catch((error) => {
                setDeleteLoading(false)
                setDeleteDialog(false)
                enqueueSnackbar("Error closing help ticket. " + error.response.data.message, { variant: "error" });
            })
    }

    const handleDeleteClose = () => {
        setDeleteDialog(false)
    }

    useEffect(() => {
        getTickets()
    }, [])
        
    return (
        <>
            <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0  }}>
                <AdminPageTitle title="Help Tickets" />
                <DataGrid
                    rows={tickets}
                    columns={columns}
                    pageSize={10}
                    loading={loading}
                    autoHeight
                />
            </Container>
            <Dialog open={deleteDialog} onClose={handleDeleteClose}>
                <DialogTitle>Delete Help Article</DialogTitle>
                <DialogContent sx={{ paddingTop: 0 }}>
                    <DialogContentText>
                        Close the selected help ticket?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose} startIcon={<CloseIcon />}>Cancel</Button>
                    <LoadingButton type="submit" loadingPosition="start" loading={deleteLoading} variant="text" color="error" startIcon={<DeleteIcon />} onClick={handleCloseTicket}>Close</LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ViewTickets