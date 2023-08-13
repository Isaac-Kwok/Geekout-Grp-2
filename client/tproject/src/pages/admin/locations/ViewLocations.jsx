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
import VisibilityIcon from "@mui/icons-material/Visibility";
import http from "../../../http";
import { useNavigate } from "react-router-dom";
import AdminPageTitle from "../../../components/AdminPageTitle";
import Modal from "@mui/material/Modal";
import { Snackbar, SnackbarContent } from "@mui/material";
import { useSnackbar } from "notistack";

// MUI React Tabs component
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

function LocationList() {
  const [locationList, setLocationList] = useState([]);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [tempNameForId, setTempNameForId] = useState(null);
  // const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

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

  // const handleSnackbarClose = () => {
  //   setSnackbarOpen(false);
  // };

  // Modal attributes
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    // border: "2px solid #888",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = useState(false);
  const handleOpen = (id) => {
    setOpen(true);
    setTempNameForId(id);
  };
  const handleClose = () => setOpen(false);

  // End of modal attributes

  const handleDetail = (id) => {
    http.get(`/admin/locations/${id}`).then((res) => {
      console.log(res.data);
      navigate(`/admin/locations/${id}`);
    });
  };

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
        handleClose(); // close modal upon successful delete
      })
      .catch((error) => {
        console.error(error);
        if (error.response && error.response.status === 400) {
          setOpen(false); // Close the modal
          enqueueSnackbar(
            "Cannot delete location with associated ride requests.",
            {
              variant: "error",
            }
          );
          // setSnackbarOpen(true); // Show snackbar notification
        }
        // Handle delete error, show an error message, etc.
      });
  };

  // Tabs
  const [value, setValue] = useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // filter location based on status
  const filterLocations = (status) => {
    return locationList.filter((location) => location.status === status);
  };
  // End of tabs component

  const columns = [
    { field: "name", headerName: "Location Name", minWidth: 200 },
    { field: "notes", headerName: "Notes", minWidth: 200, flex: 1 },
    { field: "premium", headerName: "Premium", width: 150, type: "number" },
    {
      field: "arrivals",
      headerName: "Arrivals",
      minWidth: 150,
      type: "number",
    },
    {
      field: "departures",
      headerName: "Departures",
      minWidth: 150,
      type: "number",
    },
    { field: "status", headerName: "Status", minWidth: 80 },
    {
      field: "actions",
      type: "actions",
      width: 120,
      getActions: (params) => {
        const actions = [];

        if (params.row.status !== "Pending") {
          actions.push(
            <GridActionsCellItem
              icon={<VisibilityIcon />}
              label="View Location"
              onClick={() => handleDetail(params.row.name)}
            />,
            <GridActionsCellItem
              icon={<Edit />}
              label="Edit Location"
              onClick={() => handleEdit(params.row.name)}
            />,
            <GridActionsCellItem
              icon={<Delete />}
              label={"Delete Location"}
              onClick={() => handleOpen(params.row.name)}
            />
          );
        } else {
          actions.push(
            <GridActionsCellItem
              icon={<VisibilityIcon />}
              label="Review request"
              onClick={() => handleEdit(params.row.name)}
            />,
            <GridActionsCellItem
              icon={<Delete />}
              label={"Delete request"}
              onClick={() => handleOpen(params.row.name)}
            />
          );
        }

        return actions;
      },
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
        {/* Tabs */}
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="All" value="1" />
                <Tab label="Active" value="2" />
                <Tab label="Inactive" value="3" />
                <Tab label="Pending" value="4" />
              </TabList>
            </Box>
            <TabPanel value="1">
              {/* Datagrid */}
              <DataGrid
                rows={locationList}
                columns={columns}
                pageSize={10}
                autoHeight
                getRowId={(row) => row.name}
              />
            </TabPanel>
            <TabPanel value="2">
              {/* Datagrid */}
              <DataGrid
                rows={filterLocations("Active")}
                columns={columns}
                pageSize={10}
                autoHeight
                getRowId={(row) => row.name}
              />
            </TabPanel>
            <TabPanel value="3">
              {/* Datagrid */}
              <DataGrid
                rows={filterLocations("Inactive")}
                columns={columns}
                pageSize={10}
                autoHeight
                getRowId={(row) => row.name}
              />
            </TabPanel>
            <TabPanel value="4">
              {/* Datagrid */}
              <DataGrid
                rows={filterLocations("Pending")}
                columns={columns}
                pageSize={10}
                autoHeight
                getRowId={(row) => row.name}
              />
            </TabPanel>
          </TabContext>
        </Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Are you sure you want to delete Location?
            </Typography>
            <Button
              onClick={() => {
                handleDelete(tempNameForId);
              }}
            >
              Yes
            </Button>
            <Button onClick={handleClose}>No</Button>
          </Box>
        </Modal>
        {/* Snackbar */}
        {/* <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <SnackbarContent
            message="Cannot delete location with associated ride requests."
            action={
              <Button
                color="inherit"
                size="small"
                onClick={handleSnackbarClose}
              >
                Close
              </Button>
            }
          />
        </Snackbar> */}
        {/* End of snackbar code */},
      </>
    </Container>
  );
}

export default LocationList;
