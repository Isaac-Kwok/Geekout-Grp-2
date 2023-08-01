import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Box,
  TextField,
  Grid,
  FormControlLabel,
  IconButton,
  MenuItem,
  Button,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import CardTitle from "../../components/CardTitle";
import AdminPageTitle from "../../components/AdminPageTitle";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import http from "../../http";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AddIcon from "@mui/icons-material/Add";

function EditRideRequests() {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id, userId } = useParams();
  const [locations, setLocations] = useState([]);

  const [rideRequest, setRideRequest] = useState({
    requestId: 2,
    userId: 3,
    name: "",
    date: "",
    time: "",
    pickUp: "",
    destination: "",
    numberOfPassengers: 1,
    status: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    // Fetch ride request data on component mount
    http
      .get(`/riderequests/myrequests/${userId}/specific/${id}`)
      .then((res) => {
        console.log("Ride request data:", res.data);
        setRideRequest(res.data);
      })
      .catch((err) => {
        console.error("Error:", err);
        enqueueSnackbar("Failed to fetch ride request data!", {
          variant: "error",
        });
      });
  }, [id, userId, enqueueSnackbar]);

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

  const formik = useFormik({
    initialValues: rideRequest,
    enableReinitialize: true,

    validationSchema: Yup.object({
      date: Yup.string().required("Pleae provide date of pickup!"),
      time: Yup.string().required("Please provide time of pickup!"),
      pickUp: Yup.string().required("Please provide pick-up location!"),
      destination: Yup.string().required("Please provide destination!"),
      numberOfPassengers: Yup.string().required(
        "Please provide number of passengers!"
      ),
    }),
    onSubmit: (data) => {
      console.log("test submit");
      setLoading(true);
      data.date = format(selectedDate, "yyyy-MM-dd");
      data.time = data.time.trim();
      data.pickUp = data.pickUp.trim();
      data.destination = data.destination.trim();
      data.numberOfPassengers = Number(data.numberOfPassengers);

      console.log("Data to be submitted:", data); // Log the data to be submitted

      http
        .put(`/update/${id}`, data)
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
                  {/* Date */}
                  {/* Normal text field for date */}

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

                  {/* Datepicker field for date */}
                  {/* <Grid item xs={12} sm={6}>
                    <Grid container spacing={0} alignItems="center">
                      <Grid item xs={6} sm={6}>
                        Date
                      </Grid>
                      <Grid item xs={6} sm={6}>
                        <Box width="100%">
                          <DatePicker
                            selected={selectedDate}
                            onChange={(date) => {
                              handleDateChange(date)
                              console.log("Selected date:", date);
                            }}
                            customInput={
                              <TextField fullWidth variant="outlined" />
                            }
                            placeholderText="Select Date"
                            name="date"
                            isClearable
                            scrollableYearDropdown
                            minDate={new Date()} // Set the maximum date to the current date
                            // Add the dateFormat attribute here for display in the TextField
                            dateFormat="yyyy-MM-dd" // Example: "2023-08-01"
                            showYearDropdown
                            yearDropdownItemNumber={15}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid> */}

                  {/* Time */}
                  {/* Hours and minutes split code */}
                  {/* <Grid item xs={12} sm={6}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <label
                          htmlFor="hour"
                          style={{
                            fontSize: "1rem",
                            fontWeight: 500,
                          }}
                        >
                          Time ( Hour || Minute )
                        </label>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <TextField
                          select
                          id="hour"
                          name="hour"
                          value={formik.values.hour}
                          onChange={formik.handleChange}
                          fullWidth
                          variant="outlined"
                        >
                          <MenuItem value="">
                            <em>Select hour</em>
                          </MenuItem>
                          {hours.map((hour) => (
                            <MenuItem key={hour} value={hour}>
                              {hour}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <TextField
                          select
                          id="minute"
                          name="minute"
                          value={formik.values.minute}
                          onChange={formik.handleChange}
                          fullWidth
                          variant="outlined"
                        >
                          <MenuItem value="">
                            <em>Select minute</em>
                          </MenuItem>
                          {minutes.map((minute) => (
                            <MenuItem key={minute} value={minute}>
                              {minute}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>
                  </Grid> */}

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

                  {/* Normal text field code for time */}
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

export default EditRideRequests;
