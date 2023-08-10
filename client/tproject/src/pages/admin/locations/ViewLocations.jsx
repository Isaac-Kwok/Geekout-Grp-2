import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Container,
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import http from "../../../http";
import { useNavigate } from "react-router-dom";
import AdminPageTitle from "../../../components/AdminPageTitle";

function LocationList() {
  const [locationList, setLocationList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = () => {
    http.get("/admin/locations/all").then((res) => {
      console.log(res.data);
      setLocationList(res.data);
      setImage(res.data.imageFile);
    });
  };

  const [imageFile, setImage] = useState(null);

  const handleDetail = (id) => {
    http.get(`/admin/locations/${id}`).then((res) => {
      console.log(res.data);
      navigate(`/admin/locations/${id}`);
    });
  }

  const handleEdit = (id) => {
    console.log("Edit location:", id);
    navigate(`/admin/locations/edit/${id}`);
  };

  const handleDelete = (id) => {
    http
      .delete(`/admin/locations/delete/${id}`)
      .then((res) => {
        console.log(res.data);
        // Update the location list after successful deletion
        fetchLocations();
      })
      .catch((error) => {
        console.error(error);
        // Handle delete error, show an error message, etc.
      });
  };
  

  const columns = [
    { field: 'name', headerName: 'Location Name', minWidth: 200 },
    { field: 'notes', headerName: 'Notes', minWidth: 200, flex: 1 },
    { field: 'premium', headerName: 'Premium', width: 150, type: "number" },
    { field: 'arrivals', headerName: 'Arrivals', minWidth: 150, type: "number" },
    { field: 'departures', headerName: 'Departures', minWidth: 150, type: "number" },
    { field: 'status', headerName: 'Status', minWidth: 80 },
    {
      field: 'actions', type: 'actions', width: 120, getActions: (params) => [
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="View Location"
          onClick={() => {
            handleDetail(params.row.name)
          }}
        />,
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit Location"
          onClick={() => {
            handleEdit(params.row.name)
          }}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label={"Delete Location"}
          onClick={() => {
            handleDelete(params.row.name)
          }}
        />
      ]
    },
  ];

  return (
    <Container sx={{ marginTop: "1rem", minWidth: 0 }} maxWidth="xl">
      <AdminPageTitle title="All Locations" />
      <>
        <Box sx={{ display: "flex", mb: "1rem" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/admin/locations/create")}
          >
            Create Location
          </Button>
        </Box>

        <DataGrid
          rows={locationList}
          columns={columns}
          pageSize={10}
          autoHeight
          getRowId={(row) => row.name}
        />
      </>
    </Container>
  );
}

export default LocationList;