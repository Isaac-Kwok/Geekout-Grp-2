// BicycleDetails.jsx

import React, { useEffect, useState } from 'react'
import { Container } from '@mui/material'
import { useParams } from 'react-router-dom';
import http from "../../../http";
import AdminPageTitle from '../../../components/AdminPageTitle';
import { DataGrid } from '@mui/x-data-grid';

const BicycleDetails = () => {
    const { id } = useParams(); // Get the bicycle ID from the URL
    const [bicycle, setBicycle] = useState([]);
    const [reports, setReports] = useState([]);
    const [usages, setUsages] = useState([]);
    const [loading, setLoading] = useState(true);

    const columnsReports = [
        { field: "id", headerName: "ID", minWidth: 200 },
        { field: "report", headerName: "Reports", minWidth: 50, flex: 1 },
        { field: "reportAt", headerName: "Reported At", minWidth: 50, flex: 1 },
    ];

    const columnsUsages = [
        { field: "id", headerName: "ID", minWidth: 200 },
        { field: "startPosition", headerName: "Start Position", minWidth: 50, flex: 1 },
        { field: "endPosition", headerName: "End Position", minWidth: 50, flex: 1 },
        { field: "unlockedAt", headerName: "Unlocked At", minWidth: 50, flex: 1 },
    ];
    // Fetch bicycle details using the ID or load it from the state or API

    const handleGetBicycle = () => {
        http.get("/bicycle/" + id).then((res) => {
            if (res.status === 200) {
                setBicycle(res.data)
                setLoading(false)
            }
        })
    };

    const handleGetBicycleReports = () => {
        http.get("/bicycle/reports/" + id)
            .then((res) => {
                if (res.status === 200) {
                    setReports(res.data);
                    setLoading(false);
                    console.log("Reports succesfully retrieved")
                } else {
                    console.error("Failed to fetch bicycle reports:", res.statusText);
                    setLoading(false); // Set loading to false even on error
                }
            })
            .catch((error) => {
                console.error("An error occurred while fetching bicycle reports:", error);
                setLoading(false); // Set loading to false on error
        });
    };


    const handleGetBicycleUsages = () => {
        http.get("/bicycle/usages/" + id)
            .then((res) => {
                if (res.status === 200) {
                    setUsages(res.data);
                    setLoading(false);
                    console.log("Usage succesfully retrieved")
                } else {
                    console.error("Failed to fetch bicycle usages:", res.statusText);
                    setLoading(false); // Set loading to false even on error
                }
            })
            .catch((error) => {
                console.error("An error occurred while fetching bicycle usages:", error);
                setLoading(false); // Set loading to false on error
        });
    };

    useEffect(() => {
        document.title = "EnviroGo - Bicycle Details"
        handleGetBicycle()
        handleGetBicycleReports()
        handleGetBicycleUsages()

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

                    <h2>Reports</h2>

                    <DataGrid
                    rows={reports}
                    columns={columnsReports}
                    autoHeight
                    />

                    <h2>Usage Analytics</h2>

                    <DataGrid
                    rows={usages}
                    columns={columnsUsages}
                    autoHeight
                    />
                </div>
            </Container>

        </>
    );
};

export default BicycleDetails;
