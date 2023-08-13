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
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import http from "../../../http"; // Make sure you have an HTTP module to handle API requests
import { useNavigate } from "react-router-dom";
import AdminPageTitle from "../../../components/AdminPageTitle";
import { UserContext } from "../../../index";

// MUI React Tabs component
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

function ViewAllRequests() {
  const [rideRequests, setRideRequests] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  console.log(user?.account_type == "0");

  // Fetch ride requests when the component mounts
  useEffect(() => {
    if (user) {
      console.log("User Object:", user);
      fetchRideRequests();
    }
  }, [user]); // Make sure to include user as a dependency here

  const fetchRideRequests = () => {
    // Construct the API URL with the userId

    const apiUrl = `/riderequests/allrequests`;

    // Make an API call to fetch ride requests from the backend
    // Replace "/admin/riderequests/all" with the appropriate backend route
    http
      .get(apiUrl)
      .then((res) => {
        console.log(res.data);
        setRideRequests(res.data);
      })
      .catch((error) => {
        console.error("Failed to fetch ride requests:", error);
      });
  };

  // Function to handle viewing details of a ride request (To be developed in the backend)
  // const handleDetail = (id) => {
  //   navigate(`/riderequests/${id}`);
  // };

  // Function to handle viewing a specific request
  const handleDetail = (id) => {
    navigate(`/riderequests/myrequests/${user?.id}/${id}`);
  };

  // Function to handle editing a ride request
  // const handleEdit = (id) => {
  //   navigate(`/riderequests/${user?.id}/update/${id}`);
  // };

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

  // Tabs
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Filter for tabs
  // Function to filter ride requests based on status
  const filterRideRequests = (status) => {
    return rideRequests.filter((request) => request.status === status);
  };

  // Define columns for the DataGrid
  const columns = [
    { field: "requestId", headerName: "Request ID", width: 100 },
    { field: "userId", headerName: "User ID", width: 100 },
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
          {/* <IconButton
            onClick={() => handleEdit(params.row.requestId)}
            title="Edit Request"
          >
            <Edit />
          </IconButton> */}
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
    <Container sx={{ marginTop: "1rem", minWidth: 0 }} maxWidth="xl">
      <AdminPageTitle title="Ride Requests" />
      <Box sx={{ display: "flex", mb: "1rem" }}>
        {/* Add any relevant buttons or actions here */}
        {/* <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/riderequests/create")}
        >
          Create Ride Request
        </Button> */}

        {/* <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/admin/riderequests/create")}
        >
          Create Ride Request
        </Button> */}
      </Box>

      {/* Tabs */}
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="All" value="1" />
              <Tab label="Pending" value="2" />
              <Tab label="Accepted" value="3" />
              <Tab label="Completed" value="4" />
              <Tab label="Paid" value="5" />
              <Tab label="Rated & Paid" value="6" />
            </TabList>
          </Box>
          <TabPanel value="1" sx={{p: 0, mt: "1rem"}}>
            {/* Display the ride requests in a DataGrid */}
            <DataGrid
              rows={rideRequests}
              columns={columns}
              pageSize={10}
              autoHeight
              getRowId={(row) => row.requestId}
            />
          </TabPanel>
          <TabPanel value="2">
            {/* Display the ride requests in a DataGrid */}
            <DataGrid
              rows={filterRideRequests("Pending")}
              columns={columns}
              pageSize={10}
              autoHeight
              getRowId={(row) => row.requestId}
            />
          </TabPanel>
          <TabPanel value="3">
            <DataGrid
              rows={filterRideRequests("Accepted")}
              columns={columns}
              pageSize={10}
              autoHeight
              getRowId={(row) => row.requestId}
            />
          </TabPanel>
          <TabPanel value="4">
            <DataGrid
              rows={filterRideRequests("Completed")}
              columns={columns}
              pageSize={10}
              autoHeight
              getRowId={(row) => row.requestId}
            />
          </TabPanel>
          <TabPanel value="5">
            <DataGrid
              rows={filterRideRequests("Paid")}
              columns={columns}
              pageSize={10}
              autoHeight
              getRowId={(row) => row.requestId}
            />
          </TabPanel>
          <TabPanel value="6">
            <DataGrid
              rows={filterRideRequests("Rated")}
              columns={columns}
              pageSize={10}
              autoHeight
              getRowId={(row) => row.requestId}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
}

export default ViewAllRequests;
