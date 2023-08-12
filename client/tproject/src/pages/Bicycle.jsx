import { GoogleMap, MarkerF, useLoadScript, InfoWindowF, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import { Button, Container, Stack, Divider } from '@mui/material';
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Link } from 'react-router-dom';
import '../bicycle.css';
import http from "../http";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import useUser from "../context/useUser";

const libraries = ['geometry'];

const mapContainerStyle = { width: '100%', marginBottom: '1rem' };
const bounds = {
    north: 1.493,
    south: 1.129,
    west: 103.557,
    east: 104.131,
};

function CombinedComponent({ distance, proximity, isUserOwner, isBikeUnlocked, handleLock, handleUnlock, handleReportBike }) {
    return (
        <div className="small-rectangular-component">
            <div className="top-left">Find a Bike</div>
            <div className="top-right">
                <button className="circular-button" onClick={handleReportBike}>
                    Bike missing?
                </button>
            </div>
            <div className="bottom-left">$1.00/30min</div>
            <div className="bottom-center">
                {isUserOwner ? (
                    <button className="circular-button" onClick={handleLock}>
                        {isBikeUnlocked ? 'Lock' : 'Locked'}
                    </button>
                ) : (
                    <button
                        className="circular-button"
                        onClick={handleUnlock}
                        disabled={distance > proximity || isBikeUnlocked}
                    >
                        {isBikeUnlocked
                            ? 'Locked'
                            : distance > proximity
                                ? 'Proceed to Bike to receive code'
                                : 'Unlock'}
                    </button>
                )}
            </div>
        </div>
    );
};

function Bicycle() {

    const [bicycle, setBicycle] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [directions, setDirections] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const { user, refreshUser } = useUser();
    const navigate = useNavigate();

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
        handleGetBicycle()
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

    const getDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so we add 1 and pad with '0'
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const genKey = () => {
        const min = 1000;
        const max = 9999;
        // Generate a random number between min and max (inclusive)
        const randomPasskey = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomPasskey.toString(); // Convert the number to a string
    };

    const getPasskey = () => {
        const passKey = genKey()
        toast("Your passkey is: " + passKey);

        const date = getDateTime()

        const data = {
            bicycle_lat: selectedMarker.bicycle_lat,
            bicycle_lng: selectedMarker.bicycle_lng,
            disabled: false,
            passkey: passKey,

            // for demo purpose the bicycle unlocks instantly

            unlocked: true,
            unlockedAt: date,
            user_id: user.id
        }

        const usageData = {
            bike_id: selectedMarker.id,
            unlockedAt: date,
            startPosition: `${selectedMarker.bicycle_lat},${selectedMarker.bicycle_lng}`,
            endPosition: 0,
            user_id: user.id,
            transaction: 1.00
        }

        http.put("/bicycle/" + selectedMarker.id, data).then((res) => {
            if (res.status === 200) {
                enqueueSnackbar("Bicycle key generated succesfully!", { variant: "success" });
                setIsLocked(false);
                handleGetBicycle();

                http.post("/bicycle/usages", usageData).then((res) => {
                    if (res.status === 200) {
                        console.log("Bicycle usage updated succesfully!", { variant: "success" });
                    } else {
                        console.log("Failed to update bicycle usage", { variant: "error" });
                    }
                }).catch((err) => {
                    console.log("Failed to update bicycle usage" + err.response.data.message, { variant: "error" });
                    setLoading(false);
                })
            } else {
                enqueueSnackbar("Failed to generate bicycle key", { variant: "error" });
                setLoading(false);
            }
        }).catch((err) => {
            enqueueSnackbar("Failed to getPasskey" + err.response.data.message, { variant: "error" });
            setLoading(false);
        })
    };

    const reportBike = () => {
        const id = selectedMarker.id
        navigate("/bicycle/report/" + id)
    };

    // Function to calculate the time difference between two datetime strings
    const getTimeDifference = (datetime1, datetime2) => {
        const date1 = new Date(datetime1);
        const date2 = new Date(datetime2);

        // Calculate the time difference in milliseconds
        const timeDifferenceInMs = date2 - date1;

        // You can convert the time difference to other units if needed
        // For example, to get the difference in seconds:
        const timeDifferenceInSeconds = timeDifferenceInMs / 1000;

        // To get the difference in minutes:
        const timeDifferenceInMinutes = timeDifferenceInMs / (1000 * 60);

        // To get the difference in hours:
        const timeDifferenceInHours = timeDifferenceInMs / (1000 * 60 * 60);

        // To get the difference in days:
        const timeDifferenceInDays = timeDifferenceInMs / (1000 * 60 * 60 * 24);

        // Return the time difference in the desired unit or the raw milliseconds
        return timeDifferenceInMs;
    };

    const lockBike = () => {
        const unlockedAt = selectedMarker.unlockedAt;
        const currentTime = getDateTime();

        const timeDifferenceInHours = getTimeDifference(unlockedAt, currentTime) / (1000 * 60 * 60);
        console.log("Time Difference in Hours:", timeDifferenceInHours);

        const price = Math.max(Math.round(timeDifferenceInHours / 2), 1)
        enqueueSnackbar("$" + price + " has been credited from your wallet");

        const data = {
            bicycle_lat: selectedMarker.bicycle_lat,
            bicycle_lng: selectedMarker.bicycle_lng,
            disabled: false,
            passkey: null,
            unlocked: false,
            unlockedAt: 0,
            user_id: null
        }

        const usageData = {
            endPosition: `${selectedMarker.bicycle_lat},${selectedMarker.bicycle_lng}`,
            transaction: price,
        }

        http.put("/bicycle/" + selectedMarker.id, data).then((res) => {
            if (res.status === 200) {
                enqueueSnackbar("Bicycle locked succesfully!", { variant: "success" });
                setIsLocked(true);
                handleGetBicycle();

                http.put("/bicycle/usages", usageData).then((res) => {
                    if (res.status === 200) {
                        console.log("Bicycle usage updated succesfully!", { variant: "success" });
                    } else {
                        console.log("Failed to update bicycle usage", { variant: "error" });
                    }
                }).catch((err) => {
                    console.log("Failed to update bicycle usage" + err.response.data.message, { variant: "error" });
                    setLoading(false);
                })
            } else {
                enqueueSnackbar("Failed to lock bicycle", { variant: "error" });
                setLoading(false);
            }
        }).catch((err) => {
            enqueueSnackbar("Failed to lock bicycle" + err.response.data.message, { variant: "error" });
            setLoading(false);
        })
    };

    const CombinedComponentWrapper = () => {
        const distance = selectedMarker
            ? calculateDistance(
                selectedMarker.bicycle_lat,
                selectedMarker.bicycle_lng,
                currentLocation.lat,
                currentLocation.lng
            )
            : 0; // Set a default distance value if no marker is selected

        const proximity = 100;

        const isUserOwner = selectedMarker && selectedMarker.user_id === user.id;

        // Determine if the bike is unlocked
        const isBikeUnlocked = selectedMarker && selectedMarker.unlocked;

        const handleUnlock = () => {
            // Logic to unlock the bike
            if (distance <= proximity) {
                getPasskey();
            }
            setSelectedMarker(null);
        };

        const handleLock = () => {
            // Logic to lock the bike
            lockBike();
            setSelectedMarker(null);
        };

        const handleReportBike = () => {
            // Logic to report a missing bike
            reportBike();
        };
        
        if (selectedMarker) {
            return (
                <CombinedComponent
                    distance={distance}
                    proximity={proximity}
                    isUserOwner={isUserOwner}
                    isBikeUnlocked={isBikeUnlocked}
                    handleLock={handleLock}
                    handleUnlock={handleUnlock}
                    handleReportBike={handleReportBike}
                />
            );
        }
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
                {bicycle.map(({ id, bicycle_lat, bicycle_lng, reports, disabled, passkey, registered, unlocked, unlockedAt, user_id }) => (
                    <MarkerF
                        key={id}
                        position={{ lat: bicycle_lat, lng: bicycle_lng }}
                        icon={bikeMarkerUrl}
                        onClick={() =>
                            handleMarkerClick({ id, bicycle_lat, bicycle_lng, reports, disabled, passkey, registered, unlocked, unlockedAt, user_id })
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

                {/* {renderComponent()} */}
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
            <CombinedComponentWrapper />
            <ToastContainer />
        </Container>
    );
}

export default Bicycle;