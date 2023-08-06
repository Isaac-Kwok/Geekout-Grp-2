import React, { useState, useEffect } from 'react'
import { Grid, Card, Container, CardContent, Typography, Box, Select, MenuItem, TextField, Stack, Button, InputLabel, FormControl, Divider, CardActions, Paper, InputBase, IconButton } from '@mui/material'
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SearchIcon from '@mui/icons-material/Search';
import PageTitle from '../../components/PageTitle';
import http from '../../http';

function ViewArticles() {
    const { enqueueSnackbar } = useSnackbar();
    const [articles, setArticles] = useState([])
    const [search, setSearch] = useState("")

    const getArticles = (query) => {
        const url = query ? "/support/article?q=" + query : "/support/article"
        http.get(url).then((res) => {
            if (res.status === 200) {
                setArticles(res.data);
            } else {
                enqueueSnackbar("Error getting articles.", { variant: "error" });
            }
        }).catch((err) => {
            enqueueSnackbar("Error getting articles. " + err.response.data.message, { variant: "error" });
        })
    }

    useEffect(() => {
        document.title = "EnviroGo - Help Articles"
        getArticles();
    }, [])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            getArticles(search)
          }, 500)
      
          return () => clearTimeout(delayDebounceFn)
    }, [search])

    return (
        <>
            <PageTitle title="Support" subtitle="Help Articles" />
            <Container maxWidth="xl" sx={{ marginBottom: "1rem" }}>
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ marginY: "1rem" }}>
                    <Paper elevation={3} sx={{ padding: "0.5rem", width: "100%", display: "flex", alignItems: "center" }}>
                        <InputBase sx={{ marginLeft: 1, flex: 1 }} placeholder="Search Articles" inputProps={{ 'aria-label': 'search articles' }} onChange={(e) => {setSearch(e.target.value)}} />
                        <IconButton sx={{ p: '10px' }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </Box>
                <Grid container spacing={2}>
                    {articles.length === 0 && (
                        <Grid item xs={12}>
                            <Card>
                                <CardContent sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                    <Typography variant="body1" p={0} m={0}>No articles found. Try again with another search term.</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                    {articles.map((article) => (
                        <Grid item xs={12} md={4}>
                            <Card>
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
            </Container>
        </>
    )
}

export default ViewArticles