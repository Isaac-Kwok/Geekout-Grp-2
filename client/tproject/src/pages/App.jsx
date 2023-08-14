import { Container, Box, Card, Typography, IconButton, InputBase, Grid, CardMedia, CardContent, CardActions, Button } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import ShopIcon from '@mui/icons-material/Shop';

function App() {
    useEffect(() => {
        document.title = "Home - EnviroGo";
    }, []);

    const navigate = useNavigate();

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
        backgroundSize: "cover",
        marginTop: "1rem",
        borderRadius: "5px",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        backgroundRepeat: "repeat-y",
        backgroundPosition: "bottom",
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
                <Grid container display={'flex'} alignItems={'center'} justifyContent={'center'} height={"500px"} sx={bannerStyle}>
                    <Grid item sx={cardStyle} xs={12} lg={6}>
                        <Typography variant="h3" fontSize={"24px"} fontWeight={700} textAlign={"center"}>Welcome to EnviroGo</Typography>
                        <Typography variant="h5" fontSize={"18px"} textAlign={"center"}>Your one-stop travel solution for eco-friendly travel</Typography>
                    </Grid>
                </Grid>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={"column"} marginY={"3rem"}>
                    <Typography variant="h4" fontWeight={700} marginY={"1rem"}>About EnviroGo</Typography>
                    <Card>
                        <CardContent>
                            <Typography
                                variant="body1"
                                textAlign={"center"}
                            >
                                EnviroGo is at the forefront of eco-conscious travel, blending the thrill of exploration with sustainability. We understand that today's travelers seek destinations that align with their commitment to the environment. Thus, we offer a detailed analysis of the ecological footprint of various destinations, alongside vibrant insights into their unique cultures and landscapes.
                                However, our mission extends beyond mere information. Recognizing the tales and experiences of fellow travelers, EnviroGo's platform invites users to share their personal stories and tips, fostering a global community of environmentally aware wanderers.
                                <br /><br />
                                Our dedication to reducing environmental impact has also led to the introduction of our eco-friendly rideshare and bicycle share services. We believe in not just reaching a destination but in doing so responsibly. These services, aimed at decreasing transportation-induced carbon footprints, offer travelers an immersive experience, connecting them more deeply to the places they visit.
                                EnviroGo is more than a travel website; it's a call to action. A beckoning for travelers to venture forth mindfully, ensuring that the beauty of our planet is preserved for generations. Join us in championing responsible tourism and making each journey count.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={"column"} marginY={"3rem"}>
                    <Typography variant="h4" fontWeight={700} marginTop={"1rem"}>Our Features</Typography>
                    <Grid container spacing={2} marginTop={"1rem"} justifyContent={"center"}>
                        <Grid item xs={12} lg={4}>
                            <Card>
                                <CardContent sx={featuredStyle}>
                                    <DirectionsCarIcon color='primary' sx={{ fontSize: "72px" }} />
                                    <Typography gutterBottom variant="h5" component="div" marginTop={"1rem"}>
                                        Car Ride Sharing
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" textAlign={"center"}>
                                        Share a ride with others to reduce carbon footprint!
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button variant="contained" color="primary" fullWidth onClick={() => navigate("/riderequests/myrequests")}>Book a ride</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <Card>
                                <CardContent sx={featuredStyle}>
                                    <DirectionsBikeIcon color='primary' sx={{ fontSize: "72px" }} />
                                    <Typography gutterBottom variant="h5" component="div" marginTop={"1rem"}>
                                        Bicycle Rentals
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" textAlign={"center"}>
                                        Rent a bicycle to explore the destination!
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button variant="contained" color="primary" fullWidth onClick={() => navigate("/bicycle")}>Book a bicycle</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <Card>
                                <CardContent sx={featuredStyle}>
                                    <ShopIcon color='primary' sx={{ fontSize: "72px" }} />
                                    <Typography gutterBottom variant="h5" component="div" marginTop={"1rem"}>
                                        Online Store
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" textAlign={"center"}>
                                        Buy environmentally friendly products!
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button variant="contained" color="primary" fullWidth onClick={() => navigate("/products")}>View Products</Button>
                                </CardActions>
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
