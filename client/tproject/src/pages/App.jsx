import { Container, Box, Card, Typography, IconButton, InputBase, Grid, CardMedia, CardContent } from '@mui/material';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import ShopIcon from '@mui/icons-material/Shop';

function App() {
    useEffect(() => {
        document.title = "Home - EnviroGo";
    }, []);

    const cardStyle = {
        borderRadius: "5px",
        background: "rgba(255,255,255,0.5)",
        backdropFilter: "blur(5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "4rem",
    }

    const bannerStyle = {
        backgroundImage: "url('/main_background.jpg')",
        //backgroundColor: "#0f6d51",
        backgroundSize: "contain",
        marginTop: "1rem",
        borderRadius: "5px",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
    }

    const searchStyle = {
        borderRadius: "5px",
        border: "1px solid #0f6d51",
        padding: "0.5rem",
    }

    const featuredStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    }
    return (
        <>

            <Container maxWidth="xl" sx={{ marginTop: "1rem" }}>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={"500px"} sx={bannerStyle}>
                    <Box sx={cardStyle}>
                        <Typography variant="h3" fontSize={"24px"} fontWeight={700} textAlign={"center"}>Welcome to EnviroGo</Typography>
                        <form>
                            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} marginTop={"1rem"} sx={searchStyle}>
                                <InputBase
                                    sx={{ ml: 1, flex: 1, width: "300px" }}
                                    placeholder="Where do you want to go?"
                                    inputProps={{ 'aria-label': 'Where do you want to go?' }}
                                />
                                <IconButton color="primary" aria-label="search">
                                    <SearchIcon />
                                </IconButton>
                            </Box>

                        </form>
                    </Box>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={"column"} marginY={"3rem"}>
                    <Typography variant="h4" fontWeight={700} marginTop={"1rem"}>Popular Destinations (WIP)</Typography>
                    <Grid container spacing={2} marginTop={"1rem"}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="150"
                                    image="/main_background.jpg"
                                    alt="green iguana"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        Lizard
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Lizards are a widespread group of squamate reptiles, with over 6,000
                                        species, ranging across all continents except Antarctica
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="150"
                                    image="/main_background.jpg"
                                    alt="green iguana"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        Lizard
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Lizards are a widespread group of squamate reptiles, with over 6,000
                                        species, ranging across all continents except Antarctica
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="150"
                                    image="/main_background.jpg"
                                    alt="green iguana"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        Lizard
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Lizards are a widespread group of squamate reptiles, with over 6,000
                                        species, ranging across all continents except Antarctica
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="150"
                                    image="/main_background.jpg"
                                    alt="green iguana"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        Lizard
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Lizards are a widespread group of squamate reptiles, with over 6,000
                                        species, ranging across all continents except Antarctica
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={"column"} marginY={"3rem"}>
                    <Typography variant="h4" fontWeight={700} marginTop={"1rem"}>About EnviroGo</Typography>
                    <Typography variant="body1" marginTop={"1rem"} textAlign={"center"}>EnviroGo is a website that aims to help people find the best travel destinations that are environmentally friendly. We provide information about the environmental impact of a destination, and also provide information about the destination itself. We also provide a platform for users to share their experiences and tips about the destination.</Typography>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={"column"} marginY={"3rem"}>
                    <Typography variant="h4" fontWeight={700} marginTop={"1rem"}>Our Features</Typography>
                    <Grid container spacing={2} marginTop={"1rem"} justifyContent={"center"}>
                        <Grid item xs={12} lg={4}>
                            <Card>
                                <CardContent sx={featuredStyle}>
                                    <DirectionsCarIcon color='primary' sx={{fontSize: "72px"}} />
                                    <Typography gutterBottom variant="h5" component="div" marginTop={"1rem"}>
                                        Car Ride Sharing
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" textAlign={"center"}>
                                        Share a ride with others to reduce carbon footprint!
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <Card>
                                <CardContent sx={featuredStyle}>
                                    <DirectionsBikeIcon color='primary' sx={{fontSize: "72px"}} />
                                    <Typography gutterBottom variant="h5" component="div" marginTop={"1rem"}>
                                        Bicycle Rentals
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" textAlign={"center"}>
                                        Rent a bicycle to explore the destination!
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <Card>
                                <CardContent sx={featuredStyle}>
                                    <ShopIcon color='primary' sx={{fontSize: "72px"}} />
                                    <Typography gutterBottom variant="h5" component="div" marginTop={"1rem"}>
                                        Online Store
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" textAlign={"center"}>
                                        Buy environmentally friendly products!
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                {/* <h1>Home</h1>
                <p>Welcome to the home page. This website is currently under testing. There are some buttons below to navigate between pages</p>
                <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                    <Button variant="contained" color="primary" LinkComponent={Link} to="/login">Login</Button>
                    <Button variant="contained" color="primary" LinkComponent={Link} to="/test">Test</Button>
                    <Button variant="contained" color="primary" LinkComponent={Link} to="/admin/">Admin Test</Button>
                </Stack> */}
            </Container>
        </>

    );
}

export default App;
