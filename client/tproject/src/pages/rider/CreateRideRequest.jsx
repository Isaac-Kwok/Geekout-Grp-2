import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Box,
  TextField,
  Grid,
  Select,
  FormControlLabel,
  IconButton,
  MenuItem,
  Button,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import AddIcon from "@mui/icons-material/Add";
import CardTitle from "../../components/CardTitle";
import AdminPageTitle from "../../components/AdminPageTitle";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import http from "../../http";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AspectRatio from "@mui/joy/AspectRatio";

function CreateRideRequest() {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Fetch the locations from the server using an HTTP request
    const fetchLocations = async () => {
      try {
        const response = await http.get("/admin/locations/all");
        setLocations(response.data); // set location to array of locations (response)
        console.log(locations); // Check that locations are correctly fetched
        // Log the imageFile for each location (debugging)
        locations.forEach((location) => {
          console.log(location.imageFile);
        });
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };
    fetchLocations();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    formik.setFieldValue(name, value); // Set the value directly
  };

  const formik = useFormik({
    initialValues: {
      date: "",
      time: "",
      pickUp: "",
      destination: "",
      numberOfPassengers: 1,
    },

    // Add a validation function to check if "Select Pick Up" is chosen
    validate: (values) => {
      const errors = {};

      // Check if "Select Pick Up" is chosen and set an error if it is
      if (values.pickUp === "") {
        errors.pickUp = "Please select a pick-up location!";
      }

      return errors;
    },

    validationSchema: Yup.object({
      date: Yup.string().required("Pleae provide date of pickup!"),
      time: Yup.string().required("Please provide time of pickup!"),
      pickUp: Yup.string().required("Please provide pick-up location!"),
      // imageFile: Yup.string().required("Image is required").trim(),
      destination: Yup.string().required("Please provide destination!"),
      numberOfPassengers: Yup.string().required(
        "Please provide number of passengers!"
      ),
    }),
    onSubmit: (data) => {
      console.log("test submit");
      setLoading(true);
      data.date = data.date.trim();
      data.time = data.time.trim();
      data.pickUp = data.pickUp.trim();
      data.destination = data.destination.trim();
      data.numberOfPassengers = Number(data.numberOfPassengers);

      console.log("Data to be submitted:", data); // Log the data to be submitted

      http
        .post("/riderequests/create", data)
        .then((res) => {
          console.log("Response:", res); // Log the response
          if (res.status === 200) {
            enqueueSnackbar("Ride request submitted successfully!", {
              variant: "success",
            });
            navigate("/riderequests/myrequests");
          } else {
            enqueueSnackbar("Ride request submission failed!", {
              variant: "error",
            });
          }
        })
        .catch((err) => {
          console.error("Error:", err); // Log the error
          enqueueSnackbar(
            "Ride request submission failed! " + err.response.data.message,
            { variant: "error" }
          );
        })
        .finally(() => {
          setLoading(false); // Set loading state to false after API request is complete
        });
    },
  });

  return (
    <>
      <Container maxWidth="xl" sx={{ marginTop: "1rem" }}>
        <AdminPageTitle title="Create Ride Request" backbutton />

        <Card sx={{ margin: "auto" }}>
          <Box component="form" onSubmit={formik.handleSubmit}>
            <CardContent>
              <CardTitle
                title="Ride Details"
                icon={<DirectionsCarIcon color="text.secondary" />}
              />
              <Grid container spacing={2} sx={{ marginY: "1rem" }}>
                <Grid xs={12} lg={12} spacing={1} item container>
                  <Grid item xs={6} sm={6}>
                    <TextField
                      fullWidth
                      id="date"
                      name="date"
                      label="Date"
                      variant="outlined"
                      value={formik.values.date}
                      onChange={formik.handleChange}
                      error={formik.touched.date && Boolean(formik.errors.date)}
                      helperText={formik.touched.date && formik.errors.date}
                      sx={{ marginY: "1rem" }}
                    />
                  </Grid>

                  <Grid item xs={6} sm={6}>
                    <TextField
                      fullWidth
                      id="time"
                      name="time"
                      label="Time"
                      variant="outlined"
                      value={formik.values.time}
                      onChange={formik.handleChange}
                      error={formik.touched.time && Boolean(formik.errors.time)}
                      helperText={formik.touched.time && formik.errors.time}
                      sx={{ marginY: "1rem" }}
                    />
                  </Grid>

                  {/* <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="pickUp"
                      name="pickUp"
                      label="Pick Up"
                      variant="outlined"
                      value={formik.values.pickUp}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.pickUp && Boolean(formik.errors.pickUp)
                      }
                      helperText={formik.touched.pickUp && formik.errors.pickUp}
                      sx={{ marginY: "1rem" }}
                    />
                  </Grid> */}

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="pickUp"
                      name="pickUp"
                      label="Pick Up"
                      select
                      variant="outlined"
                      value={formik.values.pickUp}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.pickUp && Boolean(formik.errors.pickUp)
                      }
                      helperText={formik.touched.pickUp && formik.errors.pickUp}
                      sx={{ marginY: "1rem" }}
                      SelectProps={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {/* Add an initial option for "Select Pick Up" */}
                      <MenuItem value="">
                        <em>Select Pick Up</em>
                      </MenuItem>
                      {/* Map over the locations array to display each location as a custom menu item */}
                      {locations.map((location) => (
                        <MenuItem key={location.name} value={location.name}>
                          <Box display="flex" alignItems="center">
                            {location.imageFile && (
                              <img
                                src={
                                  import.meta.env.VITE_API_URL +
                                  "/admin/locations/images/" +
                                  location.imageFile
                                }
                                alt={location.name}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  marginRight: "8px",
                                  borderRadius: "5px",
                                }}
                              />
                            )}
                            {location.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="destination"
                      name="destination"
                      label="Destination"
                      variant="outlined"
                      value={formik.values.destination}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.destination &&
                        Boolean(formik.errors.destination)
                      }
                      helperText={
                        formik.touched.destination && formik.errors.destination
                      }
                      sx={{ marginY: "1rem" }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      id="numberOfPassengers"
                      name="numberOfPassengers"
                      label="Number Of Passengers"
                      variant="outlined"
                      value={formik.values.numberOfPassengers}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.numberOfPassengers &&
                        Boolean(formik.errors.numberOfPassengers)
                      }
                      helperText={
                        formik.touched.numberOfPassengers &&
                        formik.errors.numberOfPassengers
                      }
                      sx={{ marginY: "1rem" }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <LoadingButton
                variant="contained"
                color="primary"
                type="submit"
                loading={loading}
                loadingPosition="start"
                startIcon={<AddIcon />}
                onClick={formik.handleSubmit}
                sx={{ marginBottom: "1rem" }}
              >
                Submit Request
              </LoadingButton>
            </CardContent>
          </Box>
        </Card>
      </Container>
    </>
  );
}

export default CreateRideRequest;
