import { GoogleMap, MarkerF, useLoadScript, InfoWindowF, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import { Button, Container, Stack, Divider } from '@mui/material';
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Link } from 'react-router-dom';
import '../bicycle.css';
import http from "../http";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSnackbar } from 'notistack';

const libraries = ['geometry'];

const mapContainerStyle = { width: '100%', marginBottom: '1rem' };
const bounds = {
    north: 1.493,
    south: 1.129,
    west: 103.557,
    east: 104.131,
};

function Bicycle() {

    const [bicycle, setBicycle] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [directions, setDirections] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    // Function to reload the LoadScript
    const reloadLoadScript = () => {
        setLoadError(false);
        // Delay the retry to prevent continuous retries on rapid failures
        setTimeout(() => {
            console.log('Reloading LoadScript...');
            window.location.reload();
        }, 3000);
    };

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        libraries: libraries,
        onError: () => setLoadError(true), // Track load errors
    });

    const center = useMemo(() => ({ lat: 1.3521, lng: 103.8198 }), []);

    const handleGetBicycle = () => {
        http.get("/bicycle").then((res) => {
            if (res.status === 200) {
                setBicycle(res.data)
                setLoading(false)
            }
        })
    };

    const handleGetLocation = (callback) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    callback({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    console.log('Successfully retrieved current location:', position.coords);
                },
                (error) => {
                    console.error('Error getting user location:', error);
                    // Retry getting location on error
                    reloadLoadScript();
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };

    const handleMarkerClick = (marker) => {
        if (marker.id === 0) {
            console.log('currentLocation:', currentLocation);
        } else {
            setSelectedMarker(marker);

            // Check if currentLocation is available
            if (!currentLocation) {
                console.error('Current location is not available 1');
                return;
            }

            setDirections(null);

            console.log('marker:', marker);
            // Calculate route from current location to the selected marker
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: currentLocation,
                    destination: { lat: marker.bicycle_lat, lng: marker.bicycle_lng },
                    travelMode: 'WALKING',
                },
                (response, status) => {
                    if (status === 'OK') {
                        setDirections(response);
                    } else {
                        console.error('Directions request failed due to ' + status);
                    }
                }
            );
        }
    };

    const handleInfoWindowClose = () => {
        setSelectedMarker(null);
    };

    const calculateDistance = (lat1, lng1, lat2, lng2) => {
        if (!window.google || !window.google.maps.geometry) {
            // Check if the 'geometry' library is available
            console.error('Google Maps geometry library not loaded');
            return null;
        }

        if (!currentLocation) {
            console.error('Current location is not available 2');
            return null;
        }

        const point1 = new window.google.maps.LatLng(lat1, lng1);
        const point2 = new window.google.maps.LatLng(lat2, lng2);

        // Calculate distance between the two points using the Maps API method
        const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
            point1,
            point2
        );

        return distance

    };

    const returnDistance = (distance) => {
        // Convert the distance from meters to kilometers
        if (distance < 1000) {
            return Math.ceil(distance) + "m"
        } else {
            return (Math.ceil(distance) / 1000) + "km"
        }
    };

    const genKey = () => {
        const min = 1000;
        const max = 9999;
        // Generate a random number between min and max (inclusive)
        const randomPasskey = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomPasskey.toString(); // Convert the number to a string
    }
    const getPasskey = () => {
        const passKey = genKey()
        toast("Your passkey is: "+passKey);

        const data = {
            bicycle_lat: selectedMarker.bicycle_lat,
            bicycle_lng: selectedMarker.bicycle_lng,
            disabled: false, 
            unlocked: true,
        }

        http.put("/bicycle/" + selectedMarker.id, data).then((res) => {
            if (res.status === 200) {
                enqueueSnackbar("Bicycle unlocked succesfully!", { variant: "success" });
                navigate("/admin/bicycle/view")
            } else {
                enqueueSnackbar("Failed to unlock bicycle test", { variant: "error" });
                setLoading(false);
            }
        }).catch((err) => {
            enqueueSnackbar("Failed to unlock bicycle" + err.response.data.message, { variant: "error" });
            setLoading(false);
        })
    };

    const SmallRectangularComponent = () => {
        if (!selectedMarker) {
            return null; // If no marker is selected, return null to render nothing
        }

        const distance = calculateDistance(
            selectedMarker.bicycle_lat,
            selectedMarker.bicycle_lng,
            currentLocation.lat,
            currentLocation.lng
        );

        const proximity = 100;

        return (
            <div className="small-rectangular-component">
                <div className="top-left">Find a Bike</div>
                <div className="top-right">
                    <button className="circular-button">Bike missing?</button>
                </div>
                <div className="bottom-left">$1.00/30min</div>
                <div className="bottom-center">
                    {distance > proximity ? 'Proceed to Bike to receive code' : <button className="circular-button" onClick={getPasskey}>Unlock</button>}
                </div>
            </div>
        );
    };

    const currentLocationMarkerUrl = "../currentlocation.png"
    const bikeMarkerUrl = "../bike.png"

    const renderMap = () => {
        return (
            <GoogleMap
                mapContainerClassName="map-container"
                center={center}
                zoom={14}
                mapContainerStyle={mapContainerStyle}
                options={{
                    restriction: {
                        latLngBounds: bounds,
                        strictBounds: true,
                    },
                }}
            >
                {/* Render Bicycle markers */}
                {bicycle.map(({ id, bicycle_lat, bicycle_lng, reports }) => (
                    <MarkerF
                        key={id}
                        position={{ lat: bicycle_lat, lng: bicycle_lng }}
                        icon={bikeMarkerUrl}
                        onClick={() =>
                            handleMarkerClick({ id, bicycle_lat, bicycle_lng, reports })
                        }
                    />
                ))}

                {/* Render Current Location Marker */}
                {currentLocation && (
                    <MarkerF
                        position={currentLocation}
                        icon={currentLocationMarkerUrl}
                        onClick={() =>
                            handleMarkerClick({
                                id: 0,
                                bicycle_lat: currentLocation.lat,
                                bicycle_lng: currentLocation.lng,
                                reports: 0,
                            })
                        }
                    />
                )}

                {/* Render Selected Marker Info Window */}
                {selectedMarker && (
                    <InfoWindowF
                        position={{
                            lat: selectedMarker.bicycle_lat + 0.0001,
                            lng: selectedMarker.bicycle_lng,
                        }}
                        onCloseClick={handleInfoWindowClose}
                    >
                        <div>
                            <p>
                                Distance:{' '}
                                {returnDistance(calculateDistance(selectedMarker.bicycle_lat, selectedMarker.bicycle_lng, currentLocation.lat, currentLocation.lng))}
                                <p></p>
                                Reports: {selectedMarker.reports}
                            </p>
                        </div>
                    </InfoWindowF>
                )}

                {/* Render Directions */}
                {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: true }} />}
            </GoogleMap>
        );
    };

    useEffect(() => {
        document.title = 'EnviroGo - View Map';
        handleGetBicycle();
        handleGetLocation(setCurrentLocation);
    }, []);

    useEffect(() => {
        // Check if currentLocation is available and map is loaded
        if (currentLocation && isLoaded) {
            setMapLoaded(true);
        }
    }, [currentLocation, isLoaded]);

    return (
        <Container maxWidth="xl" sx={{ marginTop: '1rem' }}>
            {isLoaded && mapLoaded ? (
                renderMap()
            ) : (
                <h1>Loading...</h1>
            )}
            <SmallRectangularComponent></SmallRectangularComponent>
            <ToastContainer />
        </Container>
    );
}

export default Bicycle;