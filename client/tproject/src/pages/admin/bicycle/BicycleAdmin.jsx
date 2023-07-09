import { GoogleMap, MarkerF, useLoadScript, Marker } from "@react-google-maps/api";
import { Container, Button } from '@mui/material';
import { useMemo, useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import http from "../../../http";
import '/Users/alyshaziz/FSDPProject/TProject/client/tproject/src/bicycle.css'

function BicycleAdmin() {

    const [bicycle, setBicycle] = useState([]);
    const [loading, setLoading] = useState(true)
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    });
    const center = useMemo(() => ({ lat: 1.3521, lng: 103.8198 }), []);

    const handleGetBicycle = () => {
        http.get("/bicycle").then((res) => {
            if (res.status === 200) {
                setBicycle(res.data)
                setLoading(false)
            }
        })
    }

    const markers = useMemo(
        () =>
            bicycle.map(({ id, bicycle_lat, bicycle_lng }) => (
                <MarkerF key={id} position={{ lat: bicycle_lat, lng: bicycle_lng }} />
            )),
        [bicycle]
    );

    useEffect(() => {
        document.title = "EnviroGo - View Map"
        handleGetBicycle();
    }, []);


    return (
        <Container maxWidth="xl" sx={{ marginTop: "1rem" }}>
            <Button LinkComponent={Link} variant="contained" color="primary" sx={{ marginBottom: "1rem" }} to="/admin/bicycle/view">View Bicycle</Button>

            {!isLoaded ? (
                <h1>Loading...</h1>
            ) : (
                <GoogleMap
                    mapContainerClassName="map-container"
                    center={center}
                    zoom={14}
                >
                    {markers}
                </GoogleMap>
            )}
            {/* <div>
                {bicycle.id}
            </div> */}
        </Container>
    );
}

export default BicycleAdmin