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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import http from "../../../http";
import { useNavigate } from "react-router-dom";
import AdminPageTitle from "../../../components/AdminPageTitle";

function LocationList() {
  const [locationList, setLocationList] = useState([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = () => {
    http.get("/admin/locations/all").then((res) => {
      console.log(res.data);
      setLocationList(res.data);
    });
  };

  const navigate = useNavigate();

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

  return (
    <Box sx={{ maxWidth: "100%", mx: "auto", px: 2 }}>
      <AdminPageTitle title="All Locations"/>

      {locationList.length === 0 ? (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body1" sx={{ mr: 2 }}>
            There are no locations.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/admin/locations/create")}
          >
            Create Location
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/admin/locations/create")}
            >
              Create Location
            </Button>
          </Box>

          <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Premium</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {locationList.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell>
                      <img
                        src={location.imageurl}
                        alt="Location"
                        style={{ width: "50px" }}
                      />
                    </TableCell>
                    <TableCell>{location.name}</TableCell>
                    <TableCell>{location.notes}</TableCell>
                    <TableCell>{location.premium}</TableCell>
                    <TableCell>
                      {location.status ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        aria-label="Edit"
                        onClick={() => handleEdit(location.name)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        aria-label="Delete"
                        onClick={() => handleDelete(location.name)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}

export default LocationList;
