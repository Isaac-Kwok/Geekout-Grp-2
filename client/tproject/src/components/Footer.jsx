import React from 'react'
import { Container, Typography, Divider, Box, Grid, Stack, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import StoreIcon from '@mui/icons-material/Store';
import { Email, Phone, Support } from '@mui/icons-material';

function Footer() {
    return (
        <>
            <Box sx={{
                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
                backgroundColor: "primary.main",
                color: "white.main",
            }}>
                <Container
                    maxWidth="xl"
                    sx={{
                        marginY: "1rem",
                    }}
                >
                    <Typography color={"inherit"} sx={{ fontFamily: "'caveat brush'", fontSize: "36px" }}>EnviroGo</Typography>
                    <Grid container spacing={2}>

                        <Grid item xs={12} lg={6}>
                            <Stack spacing={2} direction={{ sx: "column", lg: "row" }}>
                                <Button color='inherit' startIcon={<HomeIcon />} LinkComponent={Link} variant="text" to="/">Home</Button>
                                <Button color='inherit' startIcon={<DirectionsCarIcon />} LinkComponent={Link} variant="text" to="/riderequests/myrequests">Car</Button>
                                <Button color='inherit' startIcon={<DirectionsBikeIcon />} LinkComponent={Link} variant="text" to="/bicycle">Bicycles</Button>
                                <Button color='inherit' startIcon={<StoreIcon />} LinkComponent={Link} variant="text" to="/products">Shop</Button>
                                <Button color='inherit' startIcon={<Support />} LinkComponent={Link} variant="text" to="/support">Support</Button>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Typography fontWeight={700} variant='h6' marginBottom={"0.5rem"}>Contact Us</Typography>
                            <Stack spacing={2} direction={{ sx: "column", md: "row" }}>
                                <Box display={"flex"} alignItems={"center"}>
                                    <Email sx={{ marginRight: "1rem" }} />
                                    <Box>
                                        <Typography fontWeight={700} variant='body1'>Email</Typography>
                                        <Typography variant='body2'>
                                            support@envirogo.com
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box display={"flex"} alignItems={"center"}>
                                    <Phone sx={{ marginRight: "1rem" }} />
                                    <Box>
                                        <Typography fontWeight={700} variant='body1'>Phone</Typography>
                                        <Typography variant='body2'>
                                            +65 9123 4567
                                        </Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Divider sx={{ marginTop: "1rem", marginBottom: "1rem" }} />
                    <Link to="/about" style={{ textDecoration: "none", color:"inherit" }}>
                        <Typography color={"inherit"} sx={{ textAlign: "center" }}>EnviroGo - 2023 - Full Stack Group 1</Typography>
                    </Link>
                </Container>
            </Box>

        </>
    )
}

export default Footer