import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { Container } from '@mui/material';
import { useMemo } from "react";
import '../../bicycle.css'


function BicycleAdmin() {
    
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    });
    const center = useMemo(() => ({ lat: 1.3521, lng: 103.8198 }), []);

    return (
        <Container maxWidth="xl" sx={{ marginTop: "1rem" }}>

            {!isLoaded ? (
                <h1>Loading...</h1>
            ) : (
                <GoogleMap
                    mapContainerClassName="map-container"
                    center={center}
                    zoom={14}
                />
            )}

        </Container>
    );
}

export default BicycleAdmin