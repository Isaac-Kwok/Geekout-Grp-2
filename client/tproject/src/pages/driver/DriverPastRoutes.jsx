import React from 'react'
import { GoogleMap, MarkerF, useLoadScript, useJsApiLoader, DirectionsRenderer, Autocomplete, } from "@react-google-maps/api";
import { Avatar, Stack, Card, CardContent, Box, Container, Typography, Button, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, Input, IconButton, Grid } from '@mui/material';
import { useMemo, useState, useRef, useEffect } from "react";
import googleMapsReverseGeocoder from '../../googleMapsReverseGeocoder'
import http from '../../http'
import { CopyAllSharp } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { DataGrid } from '@mui/x-data-grid';
import useUser from '../../context/useUser';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckIcon from '@mui/icons-material/Check';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import AdminPageTitle from '../../components/AdminPageTitle';


function DriverPastRoutes() {
    const [latitude, setlatitude] = useState(1.3521)
    const [longtitude, setlongtitude] = useState(103.8198)
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_DRIVER_GOOGLE_API_KEY,
        libraries: ['places'],
    })
    const center = { lat: latitude, lng: longtitude };
    const [map, setMap] = useState(null)
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [allRoutes, setallRoutes] = useState([])
    const { user, refreshUser } = useUser();

    const originRef = useRef({})

    const columns = [
        { field: 'id', headerName: 'Ride Id', width: 70 },
        { field: 'status', headerName: 'Status', width: 120 },
        { field: 'distance', headerName: 'Distance', width: 120 },
        { field: 'duration', headerName: 'Duration', width: 120 },
        { field: 'driver_profit', headerName: 'Profit', width: 120 },
        { field: 'names', headerName: 'Rider names', width: 300 },
        { field: 'pickUp', headerName: 'Pick Up', width: 250 },
        { field: 'destinationList', headerName: 'Destinations', width: 1000 },

    ];

    function convertWaypointsStringToArray(waypointsString) {
        if (!waypointsString || waypointsString.trim() === '') {
            return []; // Return an empty array if there are no waypoints
        }

        const locations = waypointsString.split('|').map((location) => location.trim());
        locations.pop(0);

        const waypointsArray = locations.map((location) => ({
            location: location,
            stopover: true,
        }));

        return waypointsArray;
    }


    const handleRowClick = (params) => {
        let wayPoints = convertWaypointsStringToArray(params.row.destinationList)
        originRef.current.value = params.row.pickUp
        configureDestination(wayPoints, params.row.destination)
    };

    const configureDestination = async (waypoints, destination) => {
        try {
            // eslint-disable-next-line no-undef
            const directionsService = new google.maps.DirectionsService();
            const results = await directionsService.route({
                origin: originRef.current.value,
                destination: destination,
                waypoints: waypoints,
                // eslint-disable-next-line no-undef
                travelMode: google.maps.TravelMode.DRIVING,
            });
            setDirectionsResponse(results);
        } catch (error) {
            console.error('Error configuring destination:', error);
            // Handle the error here, e.g., display an error message or take appropriate action
            enqueueSnackbar("Please input a start destination", { variant: "error" })
        }
    };


    const getAllRoutes = () => {
        http.get('/driver/getRoutes')
            .then((res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    setallRoutes(res.data)
                } else {
                    console.log("Failed to retrieve routes:", res.status);
                }
            })
            .catch((err) => {
                alert("ERROR:" + JSON.stringify(err.responseJSON.error));
            })

    }
    useEffect(() => {
        refreshUser()
        console.log('user:', user)
        getAllRoutes()

    }, [])

    return (
        <>
            {!isLoaded && <div>Loading...</div>}
            {isLoaded &&
                <Box sx={{
                    border: 'solid, black',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <Container maxWidth="xl" sx={{marginBottom: "5rem" }}>
                    <AdminPageTitle title="Past Routes" backbutton />
                        <Grid container spacing={2} sx={{ marginBottom: '2rem' }}>
                            <Grid item xs={12} xl={4} md={4} sm={4} lg={4}>
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
                                                    variant="h6"
                                                >
                                                    Total Accepted Routes
                                                </Typography>
                                                <Typography variant="h4">
                                                    {user?.accepted_routes}
                                                </Typography>
                                            </Stack>
                                            <Avatar
                                                sx={{
                                                    backgroundColor: 'secondary.main',
                                                    height: 56,
                                                    width: 56
                                                }}
                                            >

                                                <DirectionsCarIcon></DirectionsCarIcon>

                                            </Avatar>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} xl={4} md={4} sm={4} lg={4}>
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
                                                    variant="h6"
                                                >
                                                    Completed Routes
                                                </Typography>
                                                <Typography variant="h4">
                                                    {user?.completed_routes}
                                                </Typography>
                                            </Stack>
                                            <Avatar
                                                sx={{
                                                    backgroundColor: 'success.main',
                                                    height: 56,
                                                    width: 56
                                                }}
                                            >

                                                <CheckIcon></CheckIcon>

                                            </Avatar>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} xl={4} md={4} sm={4} lg={4}>
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
                                                    variant="h6"
                                                >
                                                    Aborted Routes
                                                </Typography>
                                                <Typography variant="h4">
                                                    {user?.aborted_routes}
                                                </Typography>
                                            </Stack>
                                            <Avatar
                                                sx={{
                                                    backgroundColor: 'warning.main',
                                                    height: 56,
                                                    width: 56
                                                }}
                                            >
                                                <DoDisturbIcon></DoDisturbIcon>


                                            </Avatar>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={8} md={12} xm={12} xs={12}>
                                <div style={{ height: 600, width: '100%' }}>
                                    <DataGrid
                                        rows={allRoutes}
                                        columns={columns}
                                        initialState={{
                                            pagination: {
                                                paginationModel: { page: 0, pageSize: 10 },
                                            },
                                        }}
                                        pageSizeOptions={[10, 15]}
                                        onRowClick={handleRowClick}

                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12} md={12} xm={12} lg={4}>

                                <GoogleMap
                                    center={center}
                                    zoom={15}
                                    mapContainerStyle={{ width: '100%', height: '100%', minHeight: '600px', maxHeight: '900px' }}
                                    options={{
                                        zoomControl: false,
                                        streetViewControl: false,
                                        mapTypeControl: false,
                                        fullscreenControl: false,
                                    }}
                                    onLoad={map => setMap(map)}
                                >

                                    {directionsResponse && (
                                        <DirectionsRenderer directions={directionsResponse} />
                                    )}
                                </GoogleMap>
                            </Grid>

                        </Grid>
                    </Container>
                </Box>
            }
        </>

    );

}

export default DriverPastRoutes