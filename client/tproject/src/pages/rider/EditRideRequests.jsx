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
import { parseISO } from "date-fns";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from 'dayjs';

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
    dateTime: "",
    pickUp: "",
    destination: "",
    numberOfPassengers: 1,
    status: "",
    createdAt: "",
    updatedAt: "",
  });

  const handleChangeDate = (dateTime) => {
    formik.setFieldValue("dateTime", dateTime); // Update the "dateTime" field directly with the selected dateTime
  };

  // const handleChangeTime = (time) => {
  //   formik.setFieldValue("time", time);
  // };

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
    initialValues: {
      ...rideRequest,
      // Leave out time from initialValues, set it using useEffect
      dateTime: dayjs(rideRequest.dateTime),
    },
    enableReinitialize: true,

    validationSchema: Yup.object({
      dateTime: Yup.mixed().required("Please provide date & time of pickup!"),
      time: Yup.string().required("Please provide time of pickup!"),
      pickUp: Yup.string().required("Please provide pick-up location!"),
      destination: Yup.string().required("Please provide destination!"),
      numberOfPassengers: Yup.string().required(
        "Please provide number of passengers!"
      ),
    }),
    onSubmit: (data) => {
      console.log("test submit");
      console.log("dateTime", data.dateTime);
      setLoading(true);
      // data.date = format(selectedDate, "yyyy-MM-dd");
      // data.date = data.date.trim();
      // Convert the time value to the desired format "HH:mm:ss"
      // data.time = data.time.format("HH:mm:ss");
      data.pickUp = data.pickUp.trim();
      data.destination = data.destination.trim();
      data.numberOfPassengers = Number(data.numberOfPassengers);
      data.time = data.dateTime.format("HH:mm:ss");
      data.date = data.dateTime.toISOString().split("T")[0];

      console.log("Data to be submitted:", data); // Log the data to be submitted

      http
        .put(`/riderequests/update/${id}`, data)
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

  // useEffect(() => {
  //   // Once rideRequest data has loaded, set the initial value for the TimePicker
  //   if (rideRequest.time) {
  //     const initialTime = parseISO(rideRequest.time);
  //     formik.setFieldValue("time", initialTime);
  //   }
  // }, [rideRequest, formik]);

  return (
    <>
      <Container maxWidth="xl" sx={{ marginTop: "1rem" }}>
        <AdminPageTitle title="Edit Ride Request" backbutton />

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

                  {/* <Grid item xs={6} sm={6}>
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
                  </Grid> */}

                  {/* <Grid item xs={6} sm={6}>
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
                  </Grid> */}

                  {/* Time */}
                  {/* <Grid item xs={6} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        fullWidth
                        id="time"
                        name="time"
                        label="Time"
                        // slotProps={{
                        //   textField: {
                        //     helperText: "HH:MM: aa",
                        //   },
                        // }}
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

                  {/* Datepicker field for dateTime */}
                  <Grid item xs={6} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Date & Time"
                        // slotProps={{
                        //   textField: {
                        //     helperText: "MM/DD/YYYY",
                        //   },
                        // }}
                        slotProps={{ textField: { fullWidth: true } }}
                        disablePast
                        value={formik.values.dateTime}
                        onChange={handleChangeDate}
                        renderInput={(params) => (
                          <TextField {...params} variant="outlined" />
                        )}
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

                  <Grid item xs={6} sm={6}>
                    <TextField
                      fullWidth
                      id="numberOfPassengers"
                      name="numberOfPassengers"
                      label="Number Of Passengers"
                      select
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
                    >
                      <MenuItem value="">Select number of passengers</MenuItem>
                      <MenuItem value="1">1</MenuItem>
                      <MenuItem value="2">2</MenuItem>
                      <MenuItem value="3">3</MenuItem>
                    </TextField>
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
                Save Changes
              </LoadingButton>
            </CardContent>
          </Box>
        </Card>
      </Container>
    </>
  );
}

export default EditRideRequests;
