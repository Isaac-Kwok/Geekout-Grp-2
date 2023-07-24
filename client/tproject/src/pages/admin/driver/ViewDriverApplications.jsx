import React, { useEffect, useState } from 'react'
import { Avatar, Stack, Card, CardContent, Box, Container, Typography, Button, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, Input, IconButton, Grid } from '@mui/material'
import { Search, Clear } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import http from "../../../http";
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import { useSnackbar } from 'notistack'
import AdminPageTitle from '../../../components/AdminPageTitle';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';



function ViewDriverApplications() {
    const [driverApplications, setDriverApplications] = useState([])
    const [approvedApplications, setApprovedApplications] = useState([])
    const [rejectedApplications, setRejectedApplications] = useState([])
    const [pendingApplications, setPendingApplications] = useState([])
    const [deleteApplicationDialog, setDeleteApplicationDialog] = useState(false)
    const [deleteAllApplicationDialog, setDeleteAllApplicationDialog] = useState(false)
    const [deleteApplication, setDeleteApplication] = useState(null)
    const [selectedRows, setSelectedRows] = useState([]);
    const [search, setSearch] = useState('');

    const navigate = useNavigate()

    const { enqueueSnackbar } = useSnackbar();

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };
    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearchDriverApplications();
        }
        handleSearchDriverApplications();
    };
    const onClickSearch = () => {
        handleSearchDriverApplications();
    }
    const onClickClear = () => {
        setSearch('');
        handleGetDriverApplications();
    };
    const handledeleteApplicationDialogClose = () => {
        setDeleteApplicationDialog(false)
    }

    const handledeleteApplicationDialogOpen = () => {
        setDeleteApplicationDialog(true)
    }
    const handledeleteAllApplicationDialogClose = () => {
        setDeleteAllApplicationDialog(false)
    }

    const handledeleteAllApplicationDialogOpen = () => {
        if (selectedRows.length == 0) {
            enqueueSnackbar("Please select at least one application entry!", { variant: "danger" })
        }
        else {
            setDeleteAllApplicationDialog(true)
        }
    }
    // HTTP included methods
    const handleGetDriverApplications = () => {
        http.get("/admin/driver/getalldriverapplications").then((res) => {
            if (res.status === 200) {
                setDriverApplications(res.data)
            }
        })
    }
    const handleSearchDriverApplications = () => {
        http.get(`/admin/driver/SearchDriverApplication?search=${search}`).then((res) => {
            setDriverApplications(res.data);
        })
    }
    const deleteById = () => {
        http.delete("/admin/driver/deletedriverapplicationbyID/" + deleteApplication.id).then((res) => {
            if (res.status === 200) {
                setDeleteApplicationDialog(false)
                handleGetDriverApplications()
                navigate('/admin/driver/viewdriverapplications');
                enqueueSnackbar("Driver Application deleted successfully!", { variant: "success" });
            }
        })
    }
    const bulkDelete = () => {
        console.log('rows', selectedRows)
        if (selectedRows.length == 0) {
            enqueueSnackbar("No driver application entries are selected!", { variant: "danger" });
        }
        else {
            for (let index = 0; index < selectedRows.length; index++) {
                let row = selectedRows[index];
                http.delete("/admin/driver/deletedriverapplicationbyID/" + row.id).then((res) => {
                    if (res.status === 200) {
                    }
                })
            }
            setDeleteAllApplicationDialog(false);
            handleGetDriverApplications()
            navigate('/admin/driver/viewdriverapplications');
            enqueueSnackbar("Driver Applications deleted successfully!", { variant: "success" });
        }

    }


    useEffect(() => {
        console.log(selectedRows)
        handleGetDriverApplications()
    }, [])

    const columns = [
        { field: 'user_id', headerName: 'User ID', width: 70 },
        {
            field: 'driver_nric_name',
            headerName: 'Full name',
            width: 160,
            flex: 1,
        },
        { field: 'driver_nric_number', headerName: 'NRIC number', width: 100 },
        {
            field: 'driver_age',
            headerName: 'Age',
            type: 'number',
            width: 90,
        },
        {
            field: 'driver_car_model',
            headerName: 'Car model',
            width: 160,
        },
        {
            field: 'driver_car_license_plate',
            headerName: 'Car license plate',
            width: 130,
        },
        {
            field: 'driver_status',
            headerName: 'Status',
            width: 100,
        },

        {
            field: 'actions', type: 'actions', headerName: "Actions", width: 100, getActions: (params) => [
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => {
                        setDeleteApplication(params.row)
                        handledeleteApplicationDialogOpen()
                    }}
                />,
                <GridActionsCellItem
                    icon={<PreviewIcon />}
                    label="View"
                    onClick={() => {
                        navigate('/admin/driver/EditDriverApplication/' + params.row.id)
                    }}
                />
            ]
        },
    ];
    const rows = [];
    const approved = [];
    const rejected = [];
    const pending = [];
    for (let index = 0; index < driverApplications.length; index++) {
        let driverApplication = driverApplications[index];
        rows.push(driverApplication)
        if (driverApplication.driver_status == "Approved") {
            approved.push(driverApplication)
        }
        else if (driverApplication.driver_status == "Rejected") {
            rejected.push(driverApplication)
        }
        else if (driverApplication.driver_status == "Pending") {
            pending.push(driverApplication)
        }
    }


    return (
        <Container maxWidth="xl" sx={{ marginBottom: "100px", marginY: "1rem", minWidth: 0 }}>
            <AdminPageTitle title="Driver Applications" />
            <Grid container spacing={2} sx={{ marginBottom: "1.5em" }}>
                <Grid item xs={6} xl={3}>
                    <Card>
                        <CardContent>
                            <Stack
                                alignItems="flex-start"
                                direction="row"
                                justifyContent="space-between"
                                spacing={3}
                            >
                                <Stack spacing={1}>
                                    <Typography
                                        color="text.secondary"
                                        variant="overline"
                                    >
                                        Total Applications
                                    </Typography>
                                    <Typography variant="h4">
                                        {driverApplications.length}
                                    </Typography>
                                </Stack>
                                <Avatar
                                    sx={{
                                        backgroundColor: 'secondary.main',
                                        height: 56,
                                        width: 56
                                    }}
                                >

                                    <ArticleIcon />

                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} xl={3}>
                    <Card>
                        <CardContent>
                            <Stack
                                alignItems="flex-start"
                                direction="row"
                                justifyContent="space-between"
                                spacing={3}
                            >
                                <Stack spacing={1}>
                                    <Typography
                                        color="text.secondary"
                                        variant="overline"
                                    >
                                        Approved Applications
                                    </Typography>
                                    <Typography variant="h4">
                                        {approved.length}
                                    </Typography>
                                </Stack>
                                <Avatar
                                    sx={{
                                        backgroundColor: 'success.main',
                                        height: 56,
                                        width: 56
                                    }}
                                >

                                    <CheckCircleIcon />

                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} xl={3}>
                    <Card>
                        <CardContent>
                            <Stack
                                alignItems="flex-start"
                                direction="row"
                                justifyContent="space-between"
                                spacing={3}
                            >
                                <Stack spacing={1}>
                                    <Typography
                                        color="text.secondary"
                                        variant="overline"
                                    >
                                        Rejected Applications
                                    </Typography>
                                    <Typography variant="h4">
                                        {rejected.length}
                                    </Typography>
                                </Stack>
                                <Avatar
                                    sx={{
                                        backgroundColor: 'error.main',
                                        height: 56,
                                        width: 56
                                    }}
                                >
                                    <CancelIcon />

                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} xl={3}>
                    <Card>
                        <CardContent>
                            <Stack
                                alignItems="flex-start"
                                direction="row"
                                justifyContent="space-between"
                                spacing={3}
                            >
                                <Stack spacing={1}>
                                    <Typography
                                        color="text.secondary"
                                        variant="overline"
                                    >
                                        Pending Applications
                                    </Typography>
                                    <Typography variant="h4">
                                        {pending.length}
                                    </Typography>
                                </Stack>
                                <Avatar
                                    sx={{
                                        backgroundColor: '#ffc107',
                                        height: 56,
                                        width: 56
                                    }}
                                >

                                    <ArticleIcon />

                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box display={"flex"} marginBottom={"1rem"}>
                <Box flexGrow={1}>
                    <Input value={search} placeholder="Search"
                        onChange={onSearchChange}
                        onKeyDown={onSearchKeyDown} />
                    <IconButton color="primary"
                        onClick={onClickSearch}>
                        <Search />
                    </IconButton>
                    <IconButton color="primary"
                        onClick={onClickClear}>
                        <Clear />
                    </IconButton>
                </Box>

                <Button variant='contained' color='error' onClick={() => {
                    handledeleteAllApplicationDialogOpen()
                }}>
                    Delete All
                </Button>
            </Box>


            <DataGrid
                rows={rows}
                columns={columns}

                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                onRowSelectionModelChange={(ids) => {
                    const selectedIDs = new Set(ids);
                    const selectedRows = rows.filter((row) =>
                        selectedIDs.has(row.id),
                    );

                    setSelectedRows(selectedRows);
                }}
                autoHeight
            />
            <Dialog open={deleteApplicationDialog} onClose={handledeleteApplicationDialogClose}>
                <DialogTitle>Delete Driver Application</DialogTitle>
                <DialogContent sx={{ paddingTop: 0 }}>
                    <DialogContentText>
                        Are you sure you want to Delete this Application?
                        <br />
                        Application Details:
                        <ul>
                            <li>Driver Name: {deleteApplication?.driver_nric_name}</li>
                            <li>User ID: {deleteApplication?.user_id}</li>
                        </ul>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handledeleteApplicationDialogClose} startIcon={<CloseIcon />}>Cancel</Button>
                    <LoadingButton type="submit" loadingPosition="start" variant="text" color="error" startIcon={<DeleteIcon />} onClick={deleteById}>Delete</LoadingButton>
                </DialogActions>
            </Dialog>
            <Dialog open={deleteAllApplicationDialog} onClose={handledeleteAllApplicationDialogClose}>
                <DialogTitle>Delete Driver Applications</DialogTitle>
                <DialogContent sx={{ paddingTop: 0 }}>
                    <DialogContentText>
                        Are you sure you want to Delete these Applications?
                        <br />
                        Applications:
                        <ul>
                            {
                                selectedRows.map((row, i) => {
                                    return (
                                        <li>User ID: {row.user_id} | Driver Name: {row.driver_nric_name}</li>
                                    )
                                })
                            }

                        </ul>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handledeleteAllApplicationDialogClose} startIcon={<CloseIcon />}>Cancel</Button>
                    <LoadingButton type="submit" loadingPosition="start" variant="text" color="error" startIcon={<DeleteIcon />} onClick={bulkDelete}>Delete</LoadingButton>
                </DialogActions>
            </Dialog>
        </Container>

    )
}

export default ViewDriverApplications