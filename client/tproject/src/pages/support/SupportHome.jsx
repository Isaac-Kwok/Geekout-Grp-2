import React, { useState, useEffect } from 'react'
import { Grid, Card, Container, CardContent, Typography, Box, Select, MenuItem, TextField, Stack, Button, InputLabel, FormControl, Divider, CardActions } from '@mui/material'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PageTitle from '../../components/PageTitle';
import CardTitle from '../../components/CardTitle';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import SupportIcon from '@mui/icons-material/Support';
import http from '../../http';

function SupportHome() {
    const [tickets, setTickets] = useState([])
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(false)
    const columns = [
        { field: 'Status', headerName: 'Ticket Status', width: 200 },
        { field: 'title', headerName: 'Help query', flex: 1, minWidth: 300 },
        { field: 'createdAt', headerName: 'Created On', minWidth: 200 },
        { field: 'updatedAt', headerName: 'Last Updated', minWidth: 200 },
        {
            field: 'actions', type: 'actions', width: 120, getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="View Ticket"
                    onClick={() => {
                        navigate("/")
                    }}
                    showInMenu
                />,
            ]
        },
    ];

    const getArticles = () => {
        setLoading(true)
        http.get("/support/article?limit=3").then((res) => {
            if (res.status === 200) {
                setArticles(res.data);
            } else {
                enqueueSnackbar("Error getting articles.", { variant: "error" });
            }

        }).catch((err) => {
            enqueueSnackbar("Error getting articles. " + err.response.data.message, { variant: "error" });
        }).finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        document.title = "EnviroGo - Support Home"
        getArticles();
    }, [])

    return (
        <>
            <PageTitle title={"Support"} subtitle={"Support Homepage"} />
            <Container maxWidth="xl" sx={{ marginBottom: "1rem" }}>
                <Stack spacing={2}>
                    <Card>
                        <CardContent>
                            <CardTitle title={"Need Help?"} icon={<LiveHelpIcon />} />
                            <Grid container mt={"1rem"}>
                                <Grid item xs={12} md>
                                    <Typography variant="h6" textAlign={"center"}>Create Support Ticket</Typography>
                                    <Box component="form" mt={"1rem"}>
                                        <Stack direction="column" spacing={2}>
                                            <TextField
                                                fullWidth
                                                name="title"
                                                label="Title"
                                                variant="outlined"
                                            />
                                            <FormControl fullWidth>
                                                <InputLabel id="category-label">Select Category</InputLabel>
                                                <Select
                                                    labelId="category-label"
                                                    id="category"
                                                    label="Select Category"
                                                    fullWidth
                                                >
                                                    <MenuItem value={"general"}>General Enquiry</MenuItem>
                                                    <MenuItem value={"account"}>Account Issues</MenuItem>
                                                    <MenuItem value={"payment"}>Payment Issues</MenuItem>
                                                    <MenuItem value={"other"}>Others...</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <TextField
                                                fullWidth
                                                name="description"
                                                label="Description"
                                                variant="outlined"
                                                multiline
                                                rows={4}
                                            />
                                            <Button variant="contained" color="primary" type='submit' startIcon={<SupportIcon />}>Request Support</Button>
                                        </Stack>
                                    </Box>
                                </Grid>
                                <Divider orientation="vertical" sx={{ marginX: "1rem" }} flexItem />
                                <Grid item xs={12} md>
                                    <Typography variant="h6" textAlign={"center"}>Contact via Other Methods</Typography>
                                    <Stack spacing={2} mt={"1rem"}>
                                        <Stack direction="row" spacing={2} alignItems={"center"}>
                                            <LocalPhoneIcon />
                                            <Box flexGrow={1}>
                                                <Typography variant="body1" fontWeight={700}>via Telephone</Typography>
                                                <Typography variant="body1">+65 9387 6421</Typography>
                                            </Box>
                                            <Button variant='contained' color="primary">Call Now</Button>
                                        </Stack>
                                        <Stack direction="row" spacing={2} alignItems={"center"}>
                                            <EmailIcon />
                                            <Box flexGrow={1}>
                                                <Typography variant="body1" fontWeight={700}>via E-mail</Typography>
                                                <Typography variant="body1">support@tproject.com</Typography>
                                            </Box>
                                            <Button variant='contained' color="primary">Send E-mail</Button>
                                        </Stack>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <CardTitle title={"Ongoing Support Tickets"} icon={<ConfirmationNumberIcon />} />
                            <Box mt={"1rem"}>
                                <DataGrid
                                    rows={tickets}
                                    columns={columns}
                                    pageSize={10}
                                    loading={loading}
                                    autoHeight
                                />
                            </Box>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <CardTitle title={"Help Articles"} icon={<PlagiarismIcon />} />
                            <Grid container mt={"1rem"} spacing={2} mb={"1rem"}>
                                {articles.map((article) => (
                                    <Grid item xs={12} md={4}>
                                        <Card variant='outlined'>
                                            <CardContent>
                                                <Typography variant="h6">{article.title}</Typography>
                                                <Box display={"flex"} alignItems={"center"} my={"1rem"}>
                                                    <AccessTimeIcon />
                                                    <Typography variant="body1" ml={"0.5rem"}>{article.readTime} mins read</Typography>
                                                </Box>
                                                <Button variant='contained' color="primary" startIcon={<AutoStoriesIcon />} fullWidth LinkComponent={Link} to={"/support/article/" + article.id}>Read</Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                            <Button variant='outlined' color="primary" startIcon={<VisibilityIcon />} fullWidth LinkComponent={Link} to="/support/articles">View All Articles</Button>
                        </CardContent>
                    </Card>
                </Stack>

            </Container>
        </>
    )
}

export default SupportHome