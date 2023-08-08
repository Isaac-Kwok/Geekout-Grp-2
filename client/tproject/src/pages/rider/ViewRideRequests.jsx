import React, { useEffect, useState, useContext } from "react";
import {
  Container,
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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import http from "../../http"; // Make sure you have an HTTP module to handle API requests
import { useNavigate } from "react-router-dom";
import AdminPageTitle from "../../components/AdminPageTitle";
import { UserContext } from "../../index";

import RideRequestCard from "../../components/RideRequestCard"; // Adjust the path as per your folder structure

function ViewRideRequests() {
  const [rideRequests, setRideRequests] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [pickUpLocation, setPickUpLocation] = useState(null); // State to store pickUp location details
  const [imageFile, setImageFile] = useState(null);
  console.log(user);

  // Fetch ride requests when the component mounts
  useEffect(() => {
    if (user) {
      console.log("User Object:", user);
      fetchRideRequests();
    }
  }, [user]); // Make sure to include user as a dependency here

  useEffect(() => {
    if (pickUpLocation) {
      // Fetch location details and imageFile after pickUpLocation is set
      fetchLocationDetails();
    }
  }, [pickUpLocation]);

  const fetchRideRequests = () => {
    const apiUrl = `/riderequests/myrequests/${user?.id}`;

    http
      .get(apiUrl)
      .then((res) => {
        const rideRequestsData = res.data;
        // Create an array to store the promises of fetching location details for each ride request
        const locationPromises = rideRequestsData.map((rideRequest) =>
          http.get(`/admin/locations/${rideRequest.pickUp}`)
        );

        // Fetch location details for all ride requests in parallel
        Promise.all(locationPromises)
          .then((locationResponses) => {
            // Update each ride request with its location details and image file path
            const rideRequestsUpdated = rideRequestsData.map(
              (rideRequest, index) => ({
                ...rideRequest,
                locationDetails: locationResponses[index].data,
              })
            );

            // Set the updated ride requests in the state
            setRideRequests(rideRequestsUpdated);
          })
          .catch((error) => {
            console.error("Failed to fetch location details:", error);
          });
      })
      .catch((error) => {
        console.error("Failed to fetch ride requests:", error);
      });
  };

  const fetchLocationDetails = () => {
    http.get(`/admin/locations/${pickUpLocation}`).then((res) => {
      console.log("LOCATION");
      console.log(res.data);
      setImageFile(res.data.imageFile);
      console.log("Imagefile test:", imageFile);
    });
  };

  // Function to handle viewing details of a ride request (To be developed in the backend)
  // const handleDetail = (id) => {
  //   navigate(`/riderequests/${id}`);
  // };

  // Function to render ride request cards
  const renderRideRequestCards = () => {
    return rideRequests.map((rideRequest) => (
      <RideRequestCard
        key={rideRequest.requestId}
        rideRequest={rideRequest}
        handleDetail={handleDetail}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    ));
  };

  // Function to handle viewing a specific request
  const handleDetail = (id) => {
    navigate(`/riderequests/myrequests/${user?.id}/${id}`);
  };

  // Function to handle editing a ride request
  const handleEdit = (id) => {
    navigate(`/riderequests/${user?.id}/update/${id}`);
  };

  // Function to handle deleting a ride request
  const handleDelete = (id) => {
    http
      .delete(`/riderequests/delete/${id}`)
      .then((res) => {
        console.log(res.data);
        // Update the ride request list after successful deletion
        fetchRideRequests();
      })
      .catch((error) => {
        console.error("Failed to delete ride request:", error);
      });
  };

  // Define columns for the DataGrid
  const columns = [
    { field: "requestId", headerName: "ID", width: 100 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "time", headerName: "Time", width: 120 },
    { field: "pickUp", headerName: "Pickup", width: 200 },
    { field: "destination", headerName: "Destination", width: 200 },
    { field: "status", headerName: "Status", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 200,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleDetail(params.row.requestId)}
            title="View Request"
          >
            <Visibility />
          </IconButton>
          <IconButton
            onClick={() => handleEdit(params.row.requestId)}
            title="Edit Request"
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.requestId)}
            title="Delete Request"
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    // <Container sx={{ marginTop: "1rem", minWidth: 0 }} maxWidth="xl">
    //   <AdminPageTitle title="View Ride Requests" />
    //   <Box sx={{ display: "flex", mb: "1rem" }}>
    //     {/* Add any relevant buttons or actions here */}
    //     <Button
    //       variant="contained"
    //       color="primary"
    //       onClick={() => navigate("/riderequests/create")}
    //     >
    //       Create Ride Request
    //     </Button>
    //     {/* <Button
    //       variant="contained"
    //       color="primary"
    //       onClick={() => navigate("/admin/riderequests/create")}
    //     >
    //       Create Ride Request
    //     </Button> */}
    //   </Box>
    //   {/* Display the ride requests in a DataGrid */}
    //   <DataGrid
    //     rows={rideRequests}
    //     columns={columns}
    //     pageSize={10}
    //     autoHeight
    //     getRowId={(row) => row.requestId}
    //   />
    // </Container>

    // Tabs
    

    <Container sx={{ marginTop: "1rem", minWidth: 0 }} maxWidth="xl">
      <AdminPageTitle title="View Ride Requests" />
      <Box sx={{ display: "flex", mb: "1rem" }}>
        {/* Add any relevant buttons or actions here */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/riderequests/create")}
        >
          Create Ride Request
        </Button>
        {/* ... (your code) */}
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {renderRideRequestCards()}
      </Box>
      {/* Add pagination here */}
      {/* ... (your code) */}
    </Container>
  );
}

export default ViewRideRequests;
