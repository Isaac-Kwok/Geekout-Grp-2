import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Card,
  CardContent,
  Box,
  TextField,
  Grid,
  MenuItem,
  Paper,
  Typography,
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
import InfoBox from "../../components/InfoBox";
import "react-toastify/dist/ReactToastify.css";

// import DatePicker from "react-datepicker";
import { parse, parseISO } from "date-fns";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

function CreateRideRequest() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [cash, setCash] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);

  const handleChangeDate = (dateTime) => {
    formik.setFieldValue("dateTime", dateTime); // Update the "dateTime" field directly with the selected date
  };

  // Originally for MUI TimePicker component (Scraped)
  // const handleChangeTime = (time) => {
  //   formik.setFieldValue("time", time);
  //   if (!time) {
  //     // If the time value is empty, set it to an empty string
  //     formik.setFieldValue("time", "");
  //   }
  // };

  useEffect(() => {
    // Fetch the user from the server using an HTTP request
    const fetchUser = async () => {
      try {
        const response = await http.get("/user");
        setUser(response.data); // set location to array of locations (response)
        console.log("user: ", user); // Check that locations are correctly fetched
        setCash(user?.cash);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

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
      dateTime: "",
      pickUp: "",
      destination: "",
      numberOfPassengers: "",
    },

    // Add a validation function to check if "Select Pick Up" is chosen
    validate: (values) => {
      const errors = {};

      // Check if "Select Pick Up" is chosen and set an error if it is
      if (values.pickUp === "") {
        errors.pickUp = "Please indicate pick-up location!";
      }

      if (values.numberOfPassengers === "") {
        errors.pickUp = "Please indicate number of passengers!";
      }

      return errors;
    },

    validationSchema: Yup.object({
      dateTime: Yup.string().required("Pleae provide date & time of pickup!"),
      pickUp: Yup.string().required("Please provide pick-up location!"),
      // imageFile: Yup.string().required("Image is required").trim(),
      destination: Yup.string().required("Please provide destination!"),
      numberOfPassengers: Yup.string().required(
        "Please provide number of passengers!"
      ),
    }),
    onSubmit: (data) => {
      console.log("test submit");
      // console.log("date", data.dateTime);
      setLoading(true);

      // Format time in "HH:mm:ss" format
      // data.time = format(parse(data.time, "HH:mm", new Date()), "HH:mm:ss");

      // Convert the time value to the desired format "HH:mm:ss"
      // data.dateTime = data.dateTime.format("HH:mm:ss");
      data.pickUp = data.pickUp.trim();
      data.destination = data.destination.trim();
      data.numberOfPassengers = Number(data.numberOfPassengers);
      data.time = data.dateTime.format("HH:mm:ss");
      data.date = data.dateTime.toISOString().split("T")[0];

      console.log("dateTime new", data.dateTime);

      console.log("Data to be submitted:", data); // Log the data to be submitted

      if (user?.cash < 30) {
        enqueueSnackbar(
          "Ride request submission failed! Wallet balance is less than $30",
          {
            variant: "error",
          }
        );
        setLoading(false); // Set loading state to false after showing the error message
        return; // Cancel the submission
      } else {
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
      }
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
              <InfoBox
                flexGrow={1}
                title=""
                value={
                  <Typography variant="h12" fontWeight={150}>
                    <strong>Note:</strong> You must have at least $30 in balance
                    to book rides.
                  </Typography>
                }
              />
              <Grid container spacing={2} sx={{ marginY: "1rem" }}>
                <Grid xs={12} lg={12} spacing={1} item container>
                  {/* Time */}
                  {/* <Grid item xs={6} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        fullWidth
                        id="time"
                        name="time"
                        label="Time"
                        slotProps={{ textField: { fullWidth: true } }}
                        disablePast
                        value={formik.values.time}
                        onChange={handleChangeTime}
                        renderInput={(params) => (
                          <TextField {...params} variant="outlined" />
                        )}
                        error={
                          formik.touched.time && Boolean(formik.errors.time)
                        }
                        helperText={formik.touched.time && formik.errors.time}
                        sx={{ marginY: "1rem" }}
                      />
                    </LocalizationProvider>
                  </Grid> */}

                  {/* Location pickup */}
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
                      <MenuItem value="">
                        <em>Select Pick Up</em>
                      </MenuItem>
                      {locations.map(
                        (location) =>
                          // Only include locations with an active status
                          location.status === "Active" && (
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
                          )
                      )}
                    </TextField>
                  </Grid>

                  {/* Destination */}

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

                  {/* Date */}
                  {/* Datepicker field for date */}
                  <Grid item xs={6} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Date & Time"
                        slotProps={{
                          textField: { fullWidth: true },
                        }}
                        // slotProps={{
                        //   textField: {
                        //     helperText: "MM/DD/YYYY",
                        //   },
                        // }}
                        disablePast
                        value={formik.values.dateTime}
                        onChange={handleChangeDate}
                        renderInput={(params) => (
                          <TextField {...params} variant="outlined" />
                        )}
                        // minDate={new Date()} // Set minimum date to today
                        error={
                          formik.touched.dateTime &&
                          Boolean(formik.errors.dateTime)
                        }
                        helperText={
                          formik.touched.dateTime && formik.errors.dateTime
                        }
                        sx={{ marginY: "1rem" }}
                      />
                    </LocalizationProvider>
                  </Grid>

                  {/* Number of passengers */}
                  <Grid item xs={6} sm={6}>
                    <TextField
                      fullWidth
                      id="numberOfPassengers"
                      name="numberOfPassengers"
                      label="Number Of Passengers"
                      variant="outlined"
                      select
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
                    >
                      <MenuItem value="">Select number of passengers</MenuItem>
                      <MenuItem value="1">1</MenuItem>
                      <MenuItem value="2">2</MenuItem>
                      <MenuItem value="3">3</MenuItem>
                    </TextField>
                  </Grid>

                  {/* End grid container */}
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
        <Box>&nbsp;</Box>
        {/* Display this part only when cash value is loaded */}
        {user?.cash && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            padding={2}
          >
            <Paper
              elevation={3}
              sx={{ padding: "1.5rem", textAlign: "center" }}
            >
              <InfoBox
                flexGrow={1}
                title="Cash Balance"
                value={
                  <Typography variant="h5" fontWeight={700}>
                    ${user?.cash}
                  </Typography>
                }
              />
              <Button
                variant="text"
                color="primary"
                onClick={() => navigate(`/profile`)}
              >
                Top-up
              </Button>
            </Paper>
          </Box>
        )}
      </Container>
    </>
  );
}

export default CreateRideRequest;
