// BicycleDetails.jsx

import React, { useEffect, useState } from 'react'
import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'; 
import http from "../../../http";
import AdminPageTitle from '../../../components/AdminPageTitle';

const BicycleDetails = () => {
    const { id } = useParams(); // Get the bicycle ID from the URL
    const [bicycle, setBicycle] = useState([]);
    const [loading, setLoading] = useState(true)

    // Fetch bicycle details using the ID or load it from the state or API

    const handleGetBicycle = () => {
        http.get("/bicycle/" + id).then((res) => {
            if (res.status === 200) {
                setBicycle(res.data)
                setLoading(false)
            }
        })
    }
    
    useEffect(() => {
        document.title = "EnviroGo - Bicycle Details"
        handleGetBicycle()
        
    }, [])

    return (
        <>
            <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
                <AdminPageTitle title="Bicycle Details" backbutton />
                <div>
                    <h2>Bicycle ID: {id}</h2>
                    <hr />
                    <p>Bicycle Latitude: {bicycle.bicycle_lat}</p>
                    <p>Bicycle Longitude: {bicycle.bicycle_lng}</p>
                    <hr />
                    <h2>Usage Analytics</h2>

                    {/* Display more details of the bicycle here */}
                </div>
            </Container>

        </>
    );
};

export default BicycleDetails;
