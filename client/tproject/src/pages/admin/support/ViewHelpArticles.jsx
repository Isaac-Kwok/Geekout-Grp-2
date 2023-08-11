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

function ViewHelpArticles() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState([]);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteDialogData, setDeleteDialogData] = useState({});
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const columns = [
        { field: 'title', headerName: 'Article Title', minWidth: 300, flex: 1 },
        {
            field: 'isPublished', 
            headerName: 'Is Published?',
            minWidth: 200, 
            renderCell: (params) => {
                return <Chip variant="filled" size="small" icon={params.value ? <DoneIcon/> : <CloseIcon/>} label={params.value ? "Published" : "Not Published"} color={params.value ? "success" : "error"}  />;
            },
            valueGetter: (params) => {
                return params.value
            },
            type: 'singleSelect',
            valueOptions: [true, false],
        },
        {
            field: 'actions', type: 'actions', width: 120, getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit Article"
                    onClick={() => {
                        navigate("/admin/support/article/" + params.row.id)
                    }}
                    
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete Article"
                    onClick={() => {
                        setDeleteDialog(true)
                        setDeleteDialogData(params.row)
                    }}
                />,
                <GridActionsCellItem
                    icon={<VisibilityIcon />}
                    label="View Article"
                    onClick={() => {
                        navigate("/support/article/" + params.row.id)
                    }}
                />,
            ]
        },
    ];

    const getArticles = async () => {
        setLoading(true)
        http.get('/admin/support/article')
            .then((response) => {
                setArticles(response.data)
                setLoading(false)
            })
            .catch((error) => {
                enqueueSnackbar("Error getting help articles. " + error.response.data.message, { variant: "error" });
                setLoading(false)
            })
    }

    const handleDeleteArticle = () => {
        setDeleteLoading(true)
        http.delete('/admin/support/article/' + deleteDialogData.id)
            .then((response) => {
                setDeleteLoading(false)
                setDeleteDialog(false)
                getArticles()
                enqueueSnackbar("Help article deleted successfully.", { variant: "success" });
            })
            .catch((error) => {
                setDeleteLoading(false)
                setDeleteDialog(false)
                enqueueSnackbar("Error deleting help article. " + error.response.data.message, { variant: "error" });
            })
    }

    const handleDeleteClose = () => {
        setDeleteDialog(false)
    }

    useEffect(() => {
        getArticles()
    }, [])
        
    return (
        <>
            <Container maxWidth="xl" sx={{ marginY: "1rem" }}>
                <AdminPageTitle title="Help Articles" />
                <Button LinkComponent={Link} variant="contained" color="primary" sx={{ marginBottom: "1rem" }} startIcon={<NoteAddIcon />} to="/admin/support/article/create">New Article</Button>
                <DataGrid
                    rows={articles}
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
                        Delete the selected help article?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose} startIcon={<CloseIcon />}>Cancel</Button>
                    <LoadingButton type="submit" loadingPosition="start" loading={deleteLoading} variant="text" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteArticle}>Delete</LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ViewHelpArticles