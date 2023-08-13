import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import http from "../../../http";
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from "@react-google-maps/api";
import { TextField, Container, Button, CardHeader, Avatar, Divider, Box, Grid, Typography, CardMedia, CardContent, Card, Stack, } from '@mui/material';
import AdminPageTitle from '../../../components/AdminPageTitle';
import CardTitle from '../../../components/CardTitle';
import { Badge, DriveEta } from '@mui/icons-material';
import useUser from '../../../context/useUser';
import { DataGrid } from '@mui/x-data-grid';
import { BarChart, PieChart } from '@mui/x-charts';
import { axisClasses } from '@mui/x-charts';



function DriverStatistics() {
    const [latitude, setlatitude] = useState(1.3521)
    const [longtitude, setlongtitude] = useState(103.8198)
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_DRIVER_GOOGLE_API_KEY,
        libraries: ['places'],
    })
    const center = { lat: latitude, lng: longtitude };
    const [map, setMap] = useState(null)
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [allRoutes, setallRoutes] = useState()
    const { user, refreshUser } = useUser();
    const [distanceRanges, setDistanceRanges] = useState()

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
        http.get('/driver/getRoutesById/' + id)
            .then((res) => {
                if (res.status === 200) {
                    console.log('all routes', res.data);
                    setallRoutes(res.data)
                    calculateDistanceRanges(res.data);
                } else {
                    console.log("Failed to retrieve routes:", res.status);
                }
            })
            .catch((err) => {
                alert("ERROR:" + JSON.stringify(err.responseJSON.error));
            })

    }
    const navigate = useNavigate();
    const [driverApplication, setDriverApplication] = useState({
        driver_email: "",
        driver_nric_name: "",
        driver_phone_number: "",
        driver_address: "",
        driver_car_model: "",
        driver_postalcode: "",
        driver_nric_number: "",
        driver_age: "",
        driver_car_license_plate: "",
        driver_nationality: "",
        driver_sex: ""
    });
    const [status, setStatus] = useState();
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const driverPath = `${import.meta.env.VITE_API_URL}/admin/driver/driverImage/`
    const chartSetting = {
        yAxis: [
            {
                label: 'Money ($)',
            },
        ],

        height: 300,
        legend: {

        },
        sx: {
            '--ChartsLegend-itemWidth': "100px",
            '--ChartsLegend-rootSpacing': "100px",
            padding: 1,
            [`.${axisClasses.left} .${axisClasses.label}`]: {
                transform: 'rotate(-90deg) translate(0px, -20px)',
            },
        },
    };

    const valueFormatter = (value) => `$${value}`;


    function getDriverApplication() {
        http.get("/admin/driver/getDriverApplicationById/" + id).then((res) => {
            if (res.status === 200) {
                setDriverApplication(res.data);
            } else {
                enqueueSnackbar("Driver Application retrieval failed!.", { variant: "error" });
                return navigate(-1);
            }
        })
    }
    function calculateDistanceRanges(inputList) {
        const distanceRanges = [
            { id: 0, value: 0, label: 'Distance < 5KM', color: "#FFBB28" },
            { id: 1, value: 0, label: '5KM < Distance < 10KM', color: "#00C49F" },
            { id: 2, value: 0, label: 'Distance > 10KM', color: "#FF8042" },
        ];

        inputList.forEach((ride) => {
            const distanceValue = ride.distance_value;

            if (distanceValue < 5000) {
                distanceRanges[0].value += 100/inputList.length;
            } else if (distanceValue >= 5000 && distanceValue < 10000) {
                distanceRanges[1].value += 100/inputList.length;
            } else {
                distanceRanges[2].value += 100/inputList.length;
            }
        });
        setDistanceRanges(distanceRanges)
        return distanceRanges;
    }
    useEffect(() => {
        getAllRoutes();
        getDriverApplication();
    }, [])

    return (
        <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
            <AdminPageTitle title="Driver Statistics" subtitle={"Driver ID: " + driverApplication.user_id} backbutton />
            {!allRoutes && <div>Loading...</div>}
            {allRoutes &&
                <Grid container spacing={2}>
                    <Grid item lg={7}>
                    <h3>Bar chart of profit information</h3>
                        <BarChart
                            dataset={allRoutes}
                            xAxis={[{ scaleType: 'band', dataKey: 'id', label: "Route ID" }]}
                            series={[
                                { dataKey: 'total_cost', label: 'Total Profit', valueFormatter },
                                { dataKey: 'driver_profit', label: 'Driver Profit', valueFormatter },
                                { dataKey: 'company_profit', label: 'Company Profit', valueFormatter },
                            ]}
                            {...chartSetting}
                            legend={{
                                directon: "row",
                                position: {
                                  vertical: "top",
                                  horizontal: "middle"
                                }
                              }}
                        />
                    </Grid>
                    <Grid item lg={5}>
                    <h3>Pie Chart of Distance Ranges</h3>
                        <PieChart
                            series={[
                                {
                                    data: distanceRanges,
                                },
                            ]}
                            height={250}
                            sx={{
                                "--ChartsLegend-rootOffsetX": "-5rem",

                            }}

                        />
                    </Grid>
                </Grid>
            }
            <Grid container spacing={4} sx={{ marginBottom: "100px", minWidth: 0, display: "flex" }}>
                <Grid item xs={12} md={12} lg={6}>
                    <Card>
                        <CardHeader
                            avatar={
                                <Avatar sx={{ width: 100, height: 100 }} src={`${driverPath}${driverApplication.driver_face_image}`} />
                            }

                            title={driverApplication.driver_nric_name}
                            subheader={driverApplication.driver_question}
                        />
                        <Divider variant="middle" ></Divider>
                        <CardContent>
                            <Box sx={{ flexGrow: 1 }}>
                                <Grid container spacing={2} marginBottom={"1rem"}>
                                    <Grid item xs={8} >
                                        <TextField fullWidth label="NRIC" value={driverApplication.driver_nric_number} inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={4} >
                                        <TextField fullWidth label="Age" value={driverApplication.driver_age} inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="E-mail Address" value={driverApplication.driver_email} inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="Phone Number" value={driverApplication.driver_phone_number} inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <TextField fullWidth label="Nationality" value={driverApplication.driver_nationality} inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField fullWidth label="Sex" value={driverApplication.driver_sex} inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <TextField fullWidth label="Car License Number" value={driverApplication.driver_car_license_plate} inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField fullWidth label="Postal Code" value={driverApplication.driver_postalcode} inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="Car Model" value={driverApplication.driver_car_model} inputProps={{ readOnly: true }} />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1}>
                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} sx={{ marginBottom: '1rem' }}>
                                        <Typography fontWeight={700}>Car Image</Typography>
                                        <CardMedia
                                            sx={{ maxHeight: "250px", objectFit: "contain" }}
                                            component="img"
                                            alt="car image"
                                            height="auto"
                                            image={`${driverPath}${driverApplication.driver_car_image}`}
                                        />
                                        <hr />
                                        <CardTitle title="Identification Images" icon={<Badge />} />
                                    </Grid>
                                    <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                        <Typography fontWeight={700}>Driver Identification Card</Typography>
                                        <CardMedia
                                            sx={{ maxHeight: "300px", objectFit: "contain" }}
                                            component="img"
                                            alt="driver IC"
                                            height="auto"
                                            image={`${driverPath}${driverApplication.driver_ic}`}

                                        />
                                    </Grid>
                                    <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                        <Typography fontWeight={700}>Driver License</Typography>
                                        <CardMedia
                                            sx={{ maxHeight: "300px", objectFit: "contain" }}
                                            component="img"
                                            alt="driver license"
                                            height="auto"
                                            image={`${driverPath}${driverApplication.driver_license}`}
                                        />
                                    </Grid>
                                </Grid>

                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                    <Card>
                        <CardContent>

                            <Box>
                                <CardTitle title="Driver Route history" icon={<DriveEta />} />

                                {!isLoaded && !allRoutes && <div>Loading...</div>}
                                {isLoaded && allRoutes &&
                                    <Box sx={{
                                        border: 'solid, black',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}>
                                        <Container sx={{ marginTop: '2rem' }}>
                                            <Grid container spacing={2}>

                                                <div style={{ height: 400, width: '100%' }}>
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
                                        </Container>
                                    </Box>
                                }

                            </Box>


                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

export default DriverStatistics