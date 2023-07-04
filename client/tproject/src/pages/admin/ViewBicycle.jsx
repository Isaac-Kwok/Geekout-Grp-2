import React, { useEffect, useState } from 'react'
import { Container, Typography, Chip, Button, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import http from "../../http";

function ViewBicycle() {

    const [bicycle, setBicycle] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const columns = [
        { field: "id", headerName: "ID", width: 200},
        { field: "bicycle_lat", headerName: "Latitude", width: 200 },
        { field: "bicycle_lng", headerName: "Longitude", width: 200}
    ];

    const handleGetBicycle = () => {
        http.get("/bicycle").then((res) => {
            if (res.status === 200) {
                setBicycle(res.data)
                setLoading(false)
            }
        })
    }

    useEffect(() => {
        document.title = "EnviroGo - View Users"
        handleGetBicycle()
    }, [])

    return (
        <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
                <Typography variant="h3" fontWeight={700} sx={{ marginY: ["1rem", "1rem", "2rem"], fontSize: ["2rem", "2rem", "3rem"] }}>View Bicycles</Typography>
                <DataGrid
                        rows={bicycle}
                        columns={columns}
                    />
        </Container>
    )
}

export default ViewBicycle