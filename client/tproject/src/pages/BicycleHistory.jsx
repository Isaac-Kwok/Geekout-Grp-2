import { GoogleMap, MarkerF, useLoadScript, DirectionsRenderer, DirectionsService } from "@react-google-maps/api";
import { Button, Container, Grid } from '@mui/material';
import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Link } from 'react-router-dom';
import '../bicycle.css';
import http from "../http";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import useUser from "../context/useUser";

const libraries = ['geometry'];
const mapContainerStyle = { width: '50%', marginBottom: '1rem' };
const bounds = {
    north: 1.493,
    south: 1.129,
    west: 103.557,
    east: 104.131,
};
const currentLocationMarkerUrl = "../currentlocation.png"
const bikeMarkerUrl = "../bike.png"

function getCoords(latLngString) {
    const [latitude, longitude] = latLngString.split(",").map(coord => parseFloat(coord.trim()));
    return { latitude, longitude };
}

function BicycleHistory() {
    const [usages, setUsages] = useState([]);
    const [directions, setDirections] = useState(null);
    const [loading, setLoading] = useState(true);
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

    const handleGetUsages = () => {
        if (user) {
            http.get("/bicycle/usages/user/"+user.id)
                .then((res) => {
                    if (res.status === 200) {
                        const sortedUsages = res.data.sort((a, b) => {
                            const dateA = new Date(a.unlockedAt);
                            const dateB = new Date(b.unlockedAt);
                            return dateB - dateA; // Compare dates for sorting
                        });
        
                        setUsages(sortedUsages);
                        const directionsPromises = sortedUsages.map(usage => {
                            const start = getCoords(usage.startPosition);
                            const end = getCoords(usage.endPosition);
                            return calculateDirections(start, end);
                        });
                        Promise.all(directionsPromises)
                            .then(results => {
                                setDirections(results);
                            })
                            .catch(error => {
                                console.error("Error fetching directions:", error);
                            });
                    }
                })
                .catch((error) => {
                    console.error("Error fetching usages:", error);
                });
        }
    };

    const calculateDistance = (lat1, lng1, lat2, lng2) => {
        if (!window.google || !window.google.maps.geometry) {
            // Check if the 'geometry' library is available
            console.error('Google Maps geometry library not loaded');
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

    const returnTime = (milliseconds) => {
        if (milliseconds < 60000) {
            const seconds = Math.floor(milliseconds / 1000);
            return `${seconds} second${seconds !== 1 ? 's' : ''}`;
        } else if (milliseconds < 3600000) {
            const minutes = Math.floor(milliseconds / 60000);
            return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        } else {
            const hours = Math.floor(milliseconds / 3600000);
            return `${hours} hour${hours !== 1 ? 's' : ''}`;
        }
    }

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

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

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

    const calculateDirections = (start, end) => {
        return new Promise((resolve, reject) => {
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: new window.google.maps.LatLng(start.latitude, start.longitude),
                    destination: new window.google.maps.LatLng(end.latitude, end.longitude),
                    travelMode: window.google.maps.TravelMode.WALKING,
                },
                (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        resolve(result);
                    } else {
                        reject(new Error("Directions request failed with status: " + status));
                    }
                }
            );
        });
    };

    const renderUsage = (usage, index) => {
        const start = getCoords(usage.startPosition)
        const end = getCoords(usage.endPosition)
        const distance = calculateDistance(start.latitude, start.longitude, end.latitude, end.longitude)
        const time = getTimeDifference(usage.unlockedAt, usage.updatedAt)
        const center = { lat: (start.latitude + end.latitude) / 2, lng: (start.longitude + end.longitude) / 2 };

        return (
            <Container key={index}>
                <h1 style={{ textAlign: "center" }}>Date: {formatDate(usage.unlockedAt)}</h1>
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
                        draggable: false,
                        zoomControl: false,
                        streetViewControl: false,
                        fullscreenControl: false,
                        mapTypeControl: false,
                        scrollwheel: false,
                        disableDoubleClickZoom: true,
                    }}
                >
                    {start && <MarkerF position={{ lat: start.latitude, lng: start.longitude }} />}
                    {end && <MarkerF position={{ lat: end.latitude, lng: end.longitude }} />}

                    {/* Render directions if available */}
                    {directions && directions[index] && (
                        <DirectionsRenderer directions={directions[index]}
                            options={{
                                suppressMarkers: true, // This option removes the A and B markers
                            }}
                        />
                    )}
                </GoogleMap>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <h2>Time: {returnTime(time)}</h2>
                    </Grid>
                    <Grid item xs={6}>
                        <h2>Distance: {returnDistance(distance)}</h2>
                    </Grid>
                    <Grid item xs={6}>
                        <h2>Average Pace: {Number((distance / 1000) / (time / 1000 / 60)).toFixed(2)}km/h</h2>
                    </Grid>
                    <Grid item xs={6}>
                        <h2>${usage.transaction}</h2>
                    </Grid>
                </Grid>
            </Container>
        );
    };

    useEffect(() => {
        handleGetUsages()
    }, []);

    return (
        <Container maxWidth="xl" sx={{ marginTop: '1rem' }}>
            <Grid container spacing={1} justifyContent="center">
                <Grid item xs={12} justifyContent="center">
                    <h1 style={{ textAlign: "center" }}>Bicycle History</h1>
                </Grid>
            </Grid>
            {isLoaded ? (
                usages.length > 0 ? ( // Check if there are usages
                    usages.map((usage, index) => (
                        <React.Fragment key={index}>
                            {renderUsage(usage, index)} {/* Pass the index as an argument */}
                            {index < usages.length - 1 && <hr />}
                        </React.Fragment>
                    ))
                ) : (
                    <p style={{ textAlign: "center" }}>No usages</p>
                )
            ) : (
                <h1>Loading...</h1>
            )}
        </Container>
    );
}

export default BicycleHistory