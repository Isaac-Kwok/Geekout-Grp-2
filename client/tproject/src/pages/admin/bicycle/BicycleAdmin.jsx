import { GoogleMap, MarkerF, useLoadScript, InfoWindowF } from "@react-google-maps/api";
import { Container } from '@mui/material';
import { useMemo, useState, useEffect } from "react";
import { Button } from "@mui/material";
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
    const [selectedSelf, setSelectedSelf] = useState(null);

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

    // async function reverseGeocode(lat, lng, apiKey) {
    //     try {
    //         const response = await fetch(
    //             `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    //         );
    //         const data = await response.json();

    //         if (data.status === 'OK' && data.results.length > 0) {
    //             return data.results[0].formatted_address;
    //         } else {
    //             throw new Error('Reverse geocoding failed.');
    //         }
    //     } catch (error) {
    //         console.error('Error during reverse geocoding:', error);
    //         return null;
    //     }
    // };

    const handleMarkerClick = (marker) => {
        if (marker.id === 0) {
            setSelectedSelf(marker);
            console.log('currentLocation:', currentLocation);
            // reverseGeocode(currentLocation.lat, currentLocation.lng, import.meta.env.VITE_GOOGLE_API_KEY)
            // .then((address) => {
            //     console.log('Reverse Geocoded Address:', address);
            // })
            // .catch((error) => {
            //     console.error('Error:', error);
            // });
        } else {
            setSelectedMarker(marker);
            console.log('marker:', marker);
        }
    };

    const handleInfoWindowClose = () => {
        setSelectedMarker(null);
        setSelectedSelf(null);
    };

    const markers = useMemo(
        () =>
            bicycle.map(({ id, bicycle_lat, bicycle_lng, reports }) => (
                <MarkerF
                    key={id}
                    position={{ lat: bicycle_lat, lng: bicycle_lng }}
                    onClick={() => handleMarkerClick({ id, bicycle_lat, bicycle_lng, reports })} />

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
            <AdminPageTitle title="Bicycle Map" />
            <Button startIcon={<FormatListNumberedIcon />} LinkComponent={Link} variant="contained" color="primary" sx={{ marginBottom: "1rem" }} to="/admin/bicycle/view">View Bicycle List</Button>

            {!isLoaded ? (
                <h1>Loading...</h1>
            ) : (
                <GoogleMap
                    mapContainerClassName="map-container"
                    center={center}
                    zoom={14}
                    mapContainerStyle={{ width: "100%", marginBottom: "1rem" }}
                    options={{
                        restriction: {
                            latLngBounds: bounds,
                            strictBounds: true
                        }
                    }}
                >
                    {markers}
                    {currentLocation && <MarkerF position={currentLocation} onClick={() => handleMarkerClick({ id: 0, bicycle_lat: currentLocation.lat, bicycle_lng: currentLocation.lng, reports: 0 })} />}

                    {selectedSelf && (
                        <InfoWindowF
                            position={{ lat: currentLocation.lat, lng: currentLocation.lng }}
                            onCloseClick={handleInfoWindowClose}
                        >
                            <div>
                                <h3>Your Current Location</h3>
                                <p>Latitude: {currentLocation.lat}</p>
                                <p>Longitude: {currentLocation.lng}</p>
                            </div>
                        </InfoWindowF>
                    )}

                    {selectedMarker && (
                        <InfoWindowF
                            position={{ lat: selectedMarker.bicycle_lat, lng: selectedMarker.bicycle_lng }}
                            onCloseClick={handleInfoWindowClose}
                        >
                            <div>
                                <h3>Marker Information</h3>
                                <p>Latitude: {selectedMarker.bicycle_lat}</p>
                                <p>Longitude: {selectedMarker.bicycle_lng}</p>
                                <p>Reports: {selectedMarker.reports}</p>
                                <Link to={`details/${selectedMarker.id}`}>View Details</Link>
                            </div>
                        </InfoWindowF>
                    )}
                </GoogleMap>
            )}
        </Container>
    );
}

export default BicycleAdmin