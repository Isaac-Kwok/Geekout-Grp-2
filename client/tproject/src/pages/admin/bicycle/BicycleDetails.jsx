import React, { useEffect, useState } from 'react'
import { Card, CardContent, Container, Box, Grid } from '@mui/material'
import { useParams } from 'react-router-dom';
import http from "../../../http";
import AdminPageTitle from '../../../components/AdminPageTitle';
import { DataGrid } from '@mui/x-data-grid';
import CardTitle from '../../../components/CardTitle';
import { AutoGraph, DirectionsBike, Warning } from '@mui/icons-material';
import InfoBox from '../../../components/InfoBox';

const BicycleDetails = () => {
    const { id } = useParams(); // Get the bicycle ID from the URL
    const [bicycle, setBicycle] = useState([]);
    const [reports, setReports] = useState([]);
    const [usages, setUsages] = useState([]);
    const [loading, setLoading] = useState(true);

    const columnsReports = [
        { field: "id", headerName: "ID", minWidth: 100 },
        { field: "report", headerName: "Reports", minWidth: 300, flex: 1 },
        { field: "createdAt", headerName: "Reported At", minWidth: 250, valueGetter: ({ value }) => value && new Date(value), type: 'dateTime', },
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
                <AdminPageTitle title="Bicycle Details" subtitle={"Bicycle ID: " + id} backbutton />
                <Box>
                    <Card sx={{ marginBottom: "1rem" }}>
                        <CardContent>
                            <CardTitle title="Bicycle Details" icon={<DirectionsBike />} />
                            <Grid container spacing={2} marginTop={"0.5rem"}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <InfoBox title="Bicycle ID" value={id} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <InfoBox title="Bicycle Latitude" value={bicycle.bicycle_lat + " °N"} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <InfoBox title="Bicycle Longitude" value={bicycle.bicycle_lng + " °E"} />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Card sx={{ marginBottom: "1rem" }}>
                        <CardContent>
                            <CardTitle title="Bicycle Reports" icon={<Warning />} />
                            <DataGrid
                                rows={reports}
                                columns={columnsReports}
                                autoHeight
                                sx={{ marginTop: "1rem" }}
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <CardTitle title="Usage Analytics" icon={<AutoGraph />} />
                            <DataGrid
                                rows={usages}
                                columns={columnsUsages}
                                autoHeight
                                sx={{ marginTop: "1rem" }}
                            />
                        </CardContent>
                    </Card>
                </Box>
            </Container>

        </>
    );
};

export default BicycleDetails;
