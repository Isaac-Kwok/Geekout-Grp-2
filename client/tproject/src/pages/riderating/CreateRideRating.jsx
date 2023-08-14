import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Rating,
  TextField,
  Button,
} from "@mui/material";
import AdminPageTitle from "../../components/AdminPageTitle";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import * as Yup from "yup";
import http from "../../http";
import InfoBox from "../../components/InfoBox";
import LoadingButton from "@mui/lab/LoadingButton";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

function CreateRideRating() {
  // const rideRatingInstance = await RideRating.findByPk(someRatingId);
  // const associatedUser = await rideRatingInstance.getUser(); // Using the alias "user"
  const [loading, setLoading] = useState(false);
  const { userId, requestId } = useParams();
  const [route, setRoute] = useState(null);
  const [user, setUser] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [rideRequest, setRideRequest] = useState([]);
  const navigate = useNavigate();
  const [routeId, setrouteId] = useState(1)
  const [driverId, setdriverId] = useState(1)

  // Fetch the locations from the server using an HTTP request
  const fetchRideRequests = async () => {
    try {
      const response = await http.get(
        `/riderequests/myrequests/${userId}/specific/${requestId}`
      );
      setRideRequest(response.data); // set specific ride request
      console.log(rideRequest); // Check that rideRequests are correctly fetched
    } catch (error) {
      console.error("Failed to fetch ride request:", error);
    }
  };


  useEffect(() => {
    fetchRideRequests();
  }, []);

  useEffect(() => {
    // Fetch route data on component mount
    console.log("Ride id for route fetching:", requestId);
    http
      .get(`/riderequests/routes/${requestId}`)
      .then((res) => {
        console.log("Route data:", res.data);
        for (let index = 0; index < res.data.routes.length; index++) {
          const element = res.data.routes[index];
          if (element.rideIds.includes(requestId)) {
            setrouteId(element.id)
            setdriverId(element.user_id)
            console.log('tesrt', routeId, userId)
          }
        }
        
        setRoute(res.data);
      })
      .catch((err) => {
        console.error("Error:", err);
        enqueueSnackbar("Failed to fetch route data!", {
          variant: "error",
        });
      });

  }, [requestId]);




  useEffect(() => {
    // Fetch route data on component mount
    console.log("user id for user fetching:", userId);
    http
      .get(`/user`)
      .then((res) => {
        console.log("User data:", res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Error:", err);
        enqueueSnackbar("Failed to fetch route data!", {
          variant: "error",
        });
      });
  }, [userId]);

  // Formik
  const formik = useFormik({
    initialValues: {
      rating: 1,
      comment: "",
    },

    // Add a validation function to check if "Select Pick Up" is chosen
    validate: (values) => {
      const errors = {};

      // Check if "Select Pick Up" is chosen and set an error if it is
      if (values.rating === 0) {
        errors.rating = "Rating must be minimally 1!";
      }

      return errors;
    },

    validationSchema: Yup.object({
      rating: Yup.number().required("Please rate the ride"),
      comment: Yup.string(),
    }),

    onSubmit: (data) => {
      // Construct the request payload
      console.log('isthereroute', route);
      data.rating = Number(data.rating);
      data.comment = data.comment.trim();
      data.requestId = requestId;
      data.ratingId = userId + requestId;
      data.reviewer = user.name;
      data.routeId = routeId;
      data.driverId = driverId;
      console.log("data to submit:", data)

      rideRequest.status = "Rated";

      // Make the API request to create the ride rating
      http
        .post("/riderating/create", data)
        .then((response) => {
          console.log("Ride rating created:", response.data);
          enqueueSnackbar("Ride rating created successfully!", {
            variant: "success",
          });
          navigate("/riderequests/myrequests");
          // Optionally, you can handle a successful response here
        })
        .catch((error) => {
          console.error("Failed to create ride rating:", error);
          enqueueSnackbar("You have already rated this ride.", {
            variant: "error",
          });
          // Optionally, you can handle the error here
        })
        .finally(() => {
          setLoading(false); // Set loading state to false after API request is complete
        });

      http
        .put(`/riderequests/update/${requestId}`, rideRequest)
        .then((res) => {
          console.log("Response:", res); // Log the response
        })
        .catch((err) => {
          console.error("Error:", err); // Log the error
          enqueueSnackbar(
            "Ride rating submission failed! - Edit Ride request status part " +
            err.response.data.message,
            { variant: "error" }
          );
        })
        .finally(() => {
          setLoading(false); // Set loading state to false after API request is complete
        });
    },
  });

  return (
    <Container maxWidth="xl" sx={{ marginTop: "2rem" }}>
      <AdminPageTitle title="Rate Ride" backbutton />
      <Grid container spacing={3}>
        {/* Ride Details */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: "1.5rem" }}>
            <Typography variant="h5" gutterBottom>
              Ride Details
            </Typography>
            {/* Replace with actual ride data */}
            <InfoBox title="Date" value={rideRequest.date} />
            <InfoBox title="Time" value={rideRequest.time} />
            <InfoBox title="Pick Up" value={rideRequest.pickUp} />
            <InfoBox title="Destination" value={rideRequest.destination} />
            <InfoBox title="Status" value={rideRequest.status} />
            {/* Wait for route to load */}
            {route && (
              <div>
                <InfoBox title="Price ($)" value={((route?.routes[routeId - 1].total_cost)/((route.routes[routeId - 1].destinationList.split("|")).length - 1)).toFixed(2)} />
                <InfoBox title="Duration" value={route.routes[routeId - 1].duration} />
                <InfoBox title="Distance" value={route.routes[routeId - 1].distance} />
                <InfoBox
                  title="Destination(s)"
                  value={route.routes[routeId - 1].destination}
                />
              </div>
            )}
          </Paper>
        </Grid>

        {/* Form start */}

        {/* Rating and Comments */}
        <Grid
          item
          xs={12}
          md={6}
          component="form"
          onSubmit={formik.handleSubmit}
        >
          <Grid container spacing={2} direction="column">
            <Grid item>
              <Paper elevation={3} sx={{ padding: "1.5rem" }}>
                <Typography variant="h5" gutterBottom>
                  Rate Your Ride
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography>Rating:</Typography>
                  <Rating
                    id="rating"
                    name="rating"
                    defaultValue={1}
                    max={5}
                    size="large"
                    value={Number(formik.values.rating)}
                    onChange={formik.handleChange}
                    error={formik.touched.rating && Boolean(formik.errors.rating)}
                    helperText={formik.touched.rating && formik.errors.rating}
                  />
                </Box>
              </Paper>
            </Grid>

            <Grid item>
              <Paper elevation={3} sx={{ padding: "1.5rem" }}>
                <Typography variant="h5" gutterBottom>
                  Comments
                </Typography>
                <TextField
                  id="comment"
                  name="comment"
                  label="Enter your comments..."
                  multiline
                  fullWidth
                  rows={6}
                  variant="outlined"
                  value={formik.values.comment}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.comment && Boolean(formik.errors.comment)
                  }
                  helperText={formik.touched.comment && formik.errors.comment}
                />
              </Paper>
            </Grid>

            <Grid item>
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
                Submit Rating
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
        {/* Form end */}
      </Grid>
    </Container>
  );
}

export default CreateRideRating;
