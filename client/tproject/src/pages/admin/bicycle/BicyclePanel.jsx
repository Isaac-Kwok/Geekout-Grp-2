import { GoogleMap, MarkerF, useLoadScript, InfoWindowF, HeatmapLayer } from "@react-google-maps/api";
import { Container, Grid, Button, Box, TextField, Typography } from '@mui/material';
import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import http from "../../../http"
import '../../../bicycle.css'
import AdminPageTitle from "../../../components/AdminPageTitle";
import { useSnackbar } from 'notistack';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

const libraries = ['geometry', 'visualization'];

function BicyclePanel() {
    const [bicycle, setBicycle] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [addQuantity, setAddQuantity] = useState(1);
    const [enableQuantity, setEnableQuantity] = useState(1);
    const [bikesAtHQ, setBikesAtHQ] = useState();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        libraries: libraries,
    });

    const center = useMemo(() => ({ lat: 1.311, lng: 103.844 }), []);

    const handleGetBicycle = () => {
        http.get('/bicycle').then((res) => {
            if (res.status === 200) {
                setBicycle(res.data);
                setLoading(false);
            }
        });
    };

    const handleInfoWindowClose = () => {
        setSelectedMarker(null);
        setSelectedSelf(null);
    };

    const orderBicycles = async (quantity) => {
        const data = {
            bicycle_lat: 1.38,
            bicycle_lng: 103.849,
            disabled: true,
            reports: 0,
            passkey: null,
            registered: false,
            unlocked: false,
            unlockedAt: 0,
        };
        
        for (let i = 0; i < quantity; i++) {
            http.post("/bicycle", data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Bicycle added succesfully!", { variant: "success" });
                    setBikesAtHQ(prevBikes => prevBikes + 1);
                } else {
                    enqueueSnackbar("Failed to add bicycle test", { variant: "error" });
                    setLoading(false);
                }
            }).catch((err) => {
                enqueueSnackbar("Failed to add bicycle" + err.response.data.message, { variant: "error" });
                setLoading(false);
            })
        }
    };

    const getRandomCoordinateWithinBounds = () => {
        const minLat = 1.2575;
        const maxLat = 1.4705;
        const minLng = 103.6050;
        const maxLng = 104.0009;
    
        const randomLat = Math.random() * (maxLat - minLat) + minLat;
        const randomLng = Math.random() * (maxLng - minLng) + minLng;
    
        return { lat: randomLat, lng: randomLng };
    }
    
    // Example usage
    const randomCoordinate = getRandomCoordinateWithinBounds();
    console.log("Random Coordinate:", randomCoordinate);
    
    const enableAllBikes = async () => {
        const sourceLocation = { lat: 1.38, lng: 103.849 };
        
        handleGetBicycle();

        const bikesAtSource = bicycle.filter(
            (bike) => bike.bicycle_lat === sourceLocation.lat && bike.bicycle_lng === sourceLocation.lng
        );
        
        if (bikesAtSource.length === 0) {
            enqueueSnackbar("No bikes at HQ", { variant: "error" });
            return;
        }
        
        for (const bikeToUpdate of bikesAtSource) {
            const newLocation = getRandomCoordinateWithinBounds(); // Get a new location for each bike
        
            const updatedData = {
                bicycle_lat: newLocation.lat,
                bicycle_lng: newLocation.lng,
                registered: 1,
                disabled: 0
                // ... other properties
            };
        
            await http.put(`/bicycle/${bikeToUpdate.id}`, updatedData); // Replace with your actual endpoint
        }
        
        setBikesAtHQ(0);
        enqueueSnackbar(`All bicycles enabled successfully!`, { variant: "success" });
        handleGetBicycle(); // Refresh the bike data
    };
    
    
    const renderControlPanel = () => {
        return (
            <Box sx={{ padding: '1rem', borderTop: '1px solid #ccc' }}>
                <Typography variant="h6" gutterBottom>
                    Control Panel
                </Typography>
                <Box sx={{ borderBottom: '1px solid #ccc', padding: '0.5rem 0' }}>
                    <TextField
                        label="Order Quantity"
                        variant="outlined"
                        type="number"
                        value={addQuantity}
                        onChange={(e) => setAddQuantity(parseInt(e.target.value))}
                    />
                    <Button variant="contained" onClick={() => orderBicycles(addQuantity)} sx={{ marginLeft: '1rem' }}>
                        Add Bicycles
                    </Button>
                </Box>
                <Box sx={{ borderBottom: '1px solid #ccc', padding: '0.5rem 0' }}>
                    <Typography variant="body1">
                        Bicycles at HQ: {bikesAtHQ}
                    </Typography>
                </Box>
                <Box sx={{ padding: '0.5rem 0' }}>
                    <Button variant="contained" onClick={enableAllBikes} sx={{ marginLeft: '1rem' }}>
                        Enable All Bicycles
                    </Button>
                </Box>
            </Box>
        );
    };

    const renderMap = () => {
        const heatmapData = bicycle.map(({ bicycle_lat, bicycle_lng }) => ({
            location: new google.maps.LatLng(bicycle_lat, bicycle_lng),
            weight: 5, // You can adjust the weight based on your data
        }));

        return (
            <GoogleMap
                mapContainerClassName="map-container"
                center={center}
                zoom={14}
                mapContainerStyle={{ width: '100%', marginBottom: '1rem' }}
                options={{
                    restriction: {
                        latLngBounds: bounds,
                        strictBounds: true,
                    },
                }}
            >
                <HeatmapLayer data={heatmapData} />

                {selectedMarker && (
                    <InfoWindowF position={{ lat: selectedMarker.bicycle_lat, lng: selectedMarker.bicycle_lng }} onCloseClick={handleInfoWindowClose}>
                        <div>
                            <h3>Bicycle Information</h3>
                            <p>Latitude: {selectedMarker.bicycle_lat}</p>
                            <p>Longitude: {selectedMarker.bicycle_lng}</p>
                            <p>Reports: {selectedMarker.reports}</p>
                            <Link to={`details/${selectedMarker.id}`}>View Details</Link>
                        </div>
                    </InfoWindowF>
                )}
            </GoogleMap>
        )
    }

    const bounds = {
        north: 1.493,
        south: 1.129,
        west: 103.557,
        east: 104.131,
    };

    useEffect(() => {
        document.title = 'EnviroGo - View Map';

        // Fetch bicycle data
        http.get('/bicycle').then((res) => {
            if (res.status === 200) {
                setBicycle(res.data);
                setLoading(false);

                // Calculate bicyclesAtHQ based on the fetched bicycle data
                const bicyclesAtHQ = res.data.filter(
                    (bike) => bike.bicycle_lat === 1.38 && bike.bicycle_lng === 103.849
                ).length;
                setBikesAtHQ(bicyclesAtHQ);
            }
        });
    }, []); // Run only on initial mount

    return (
        <Container maxWidth="xl" sx={{ marginTop: '1rem' }}>
            <AdminPageTitle title="Bicycle Heatmap" />

            <Grid container spacing={2}>
                <Grid item xs={8}>
                    {!isLoaded ? <h1>Loading...</h1> : renderMap()}
                </Grid>
                <Grid item xs={4}>
                    {renderControlPanel()}
                </Grid>
            </Grid>
        </Container>
    );
};

export default BicyclePanel;