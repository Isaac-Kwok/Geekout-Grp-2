import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
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