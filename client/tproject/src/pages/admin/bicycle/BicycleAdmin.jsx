import { GoogleMap, MarkerF, useLoadScript, InfoWindowF } from "@react-google-maps/api";
import { Container } from '@mui/material';
import { useMemo, useState, useEffect } from "react";
import {Button} from "@mui/material";
import { Link } from 'react-router-dom';
import http from "../../../http"
import '../../../bicycle.css'
import AdminPageTitle from "../../../components/AdminPageTitle";
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

function BicycleAdmin() {

    const [bicycle, setBicycle] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    });
    const center = useMemo(() => ({ lat: 1.311, lng: 103.844 }), []);

    const handleGetBicycle = () => {
        http.get("/bicycle").then((res) => {
            if (res.status === 200) {
                setBicycle(res.data)
                setLoading(false)
            }
        })
    }

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                },
                (error) => {
                    console.error('Error getting user location:', error);
                }
            )
        } 
        else {
            console.error('Geolocation is not supported by this browser.');
        }
    };

    const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
        console.log(marker)
    };

    const handleInfoWindowClose = () => {
        setSelectedMarker(null);
    };

    const markers = useMemo(
        () =>
            bicycle.map(({ id, bicycle_lat, bicycle_lng }) => (
                <MarkerF 
                key={id} 
                position={{ lat: bicycle_lat, lng: bicycle_lng }}
                onClick={() => handleMarkerClick({id, bicycle_lat, bicycle_lng})} />

            )),
        [bicycle]
    );

    const bounds = {
        north: 1.493,
        south: 1.129,
        west: 103.557,
        east: 104.131
    };

    useEffect(() => {
        document.title = "EnviroGo - View Map"
        handleGetBicycle();
        handleGetLocation();
    }, []);


    return (
        <Container maxWidth="xl" sx={{ marginTop: "1rem" }}>
            <AdminPageTitle title="Bicycle Map"/>
            <Button startIcon={<FormatListNumberedIcon/>} LinkComponent={Link} variant="contained" color="primary" sx={{ marginBottom: "1rem" }} to="/admin/bicycle/view">View Bicycle List</Button>

            {!isLoaded ? (
                <h1>Loading...</h1>
            ) : (
                <GoogleMap
                    mapContainerClassName="map-container"
                    center={center}
                    zoom={14}
                    mapContainerStyle={{width: "100%", marginBottom: "1rem"}}
                    options={{
                        restriction: {
                        latLngBounds: bounds,
                        strictBounds: true
                        }
                    }}
                >
                    {markers}
                    {currentLocation && <MarkerF position={currentLocation} />}
                    {selectedMarker && (
                        <InfoWindowF
                        position={{ lat: selectedMarker.bicycle_lat, lng: selectedMarker.bicycle_lng }}
                        onCloseClick={handleInfoWindowClose}
                        >
                        <div>
                            <h3>Marker Information</h3>
                            <p>Latitude: {selectedMarker.bicycle_lat}</p>
                            <p>Longitude: {selectedMarker.bicycle_lng}</p>
                        </div>
                        </InfoWindowF>
                    )}
                </GoogleMap>
            )}
        </Container>
    );
}

export default BicycleAdmin