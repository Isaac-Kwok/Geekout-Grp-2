import React from 'react'
import { GoogleMap, MarkerF, useLoadScript, useJsApiLoader, DirectionsRenderer, Autocomplete, } from "@react-google-maps/api";
import { Button, Container, Stack, Divider, Grid, Card, CardContent, Box, TextField, Typography } from '@mui/material';
import { useMemo, useState, useRef, useEffect } from "react";
import googleMapsReverseGeocoder from '../../googleMapsReverseGeocoder'
import http from '../../http'
import { CopyAllSharp } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { DataGrid } from '@mui/x-data-grid';


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
    const [visibleRoutes, setVisibleRoutes] = useState();
    const { enqueueSnackbar } = useSnackbar();
    const [allRoutes, setallRoutes] = useState([])

    const originRef = useRef({})

    const columns = [
        { field: 'id', headerName: 'Ride Id', width: 70 },
        { field: 'distance', headerName: 'Distance', width: 120 },
        { field: 'duration', headerName: 'Duration', width: 120 },
        { field: 'driver_profit', headerName: 'Profit', width: 120 },
        { field: 'names', headerName: 'Rider names', width: 300 },
        { field: 'pickUp', headerName: 'Pick Up', width: 200 },
        { field: 'wayPoints', headerName: 'Way Points', width: 400 },
        { field: 'destination', headerName: 'Destination', width: 200 },

    ];

    function convertWaypointsStringToArray(waypointsString) {
        if (!waypointsString || waypointsString.trim() === '') {
            return []; // Return an empty array if there are no waypoints
        }

        const locations = waypointsString.split(',').map((location) => location.trim());

        const waypointsArray = locations.map((location) => ({
            location: location,
            stopover: true,
        }));

        return waypointsArray;
    }


    const handleRowClick = (params) => {
        let wayPoints = convertWaypointsStringToArray(params.row.wayPoints)
        console.log('test w:', wayPoints)
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
                optimizeWaypoints: true,
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
        console.log('test')
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
                    <Container maxWidth="xl" sx={{ marginTop: '2rem' }}>
                        <Grid container spacing={2}>
                            <Grid item lg={8}>
                                <div style={{ height: 700, width: '100%' }}>
                                    <DataGrid
                                        rows={allRoutes}
                                        columns={columns}
                                        initialState={{
                                            pagination: {
                                                paginationModel: { page: 0, pageSize: 5 },
                                            },
                                        }}
                                        pageSizeOptions={[5, 10]}
                                        onRowClick={handleRowClick}

                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12} lg={4} md={7} sm={12}>

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
                                    <MarkerF position={center} />
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