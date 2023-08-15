import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardMedia, Container, Typography, Divider, Stack, Grid, Dialog, DialogContent, DialogActions, DialogTitle, Button } from '@mui/material'
import CardTitle from '../components/CardTitle'
import { Close, Info } from '@mui/icons-material'
import InfoBox from '../components/InfoBox'

function About() {

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = (e) => {
        setOpen(false);
    };

    useEffect(() => {
        document.title = "About - EnviroGo";
    }, []);
    
    return (
        <>
            <Container maxWidth="md">
                <Card sx={{ marginY: "1rem" }}>
                    <div onClick={handleOpen}>
                        <CardMedia
                            component="img"
                            height="250"
                            image="/about.jpg"
                            alt="Material Forest"
                        />
                    </div>
                    <CardContent>
                        <CardTitle title="About EnviroGo" back="/" icon={<Info />} />
                        <Typography variant="body2" color="text.secondary" marginTop={"0.5rem"}>
                            EnviroGo is a web application that allows users to create and join carpooling sessions to reduce carbon emissions as well as renting bicycles for a more eco-friendly mode of transport.
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h5" fontWeight={700} marginBottom={"1rem"}>Credits</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <InfoBox title="General Design, User Management & Support" value="Joseph Lee" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <InfoBox title="Driver Management & Routing System" value="Yuk Ka Chyun" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <InfoBox title="Ride Requests & Pick-Up Locations" value="Gregory Chua" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <InfoBox title="Bicycle Management" value="Azrel" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <InfoBox title="Online Shop Management" value="Samuel Ong" />
                            </Grid>
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h5" fontWeight={700} marginBottom={"1rem"}>Technologies</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <InfoBox title="Frontend" value="ReactJS, Material UI" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <InfoBox title="Backend" value="NodeJS, ExpressJS, Socket.io, MySQL" />
                            </Grid>
                            <Grid item xs={12}>
                                <InfoBox title="APIs" value="Google Maps, Google Geocoding, Google Directions, Stripe, OAuth (Google & Facebook)" />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Container>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Secret Dialog</DialogTitle>
                <DialogContent>
                    <iframe width="100%" height="315" src="https://www.youtube.com/embed/KC5PzT2zDlU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </DialogContent>
                <DialogActions>
                    <Button startIcon={<Close/>} onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>

    )
}

export default About