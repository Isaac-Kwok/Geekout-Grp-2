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
  const { enqueueSnackbar } = useSnackbar();
  const [rideRequest, setRideRequest] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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
    fetchRideRequests();
  }, []);

  const formik = useFormik({
    initialValues: {
      stars: 1,
      comment: "",
    },

    // Add a validation function to check if "Select Pick Up" is chosen
    validate: (values) => {
      const errors = {};

      // Check if "Select Pick Up" is chosen and set an error if it is
      if (values.stars === 0) {
        errors.pickUp = "Stars must be minimally 1!";
      }

      return errors;
    },

    validationSchema: Yup.object({
      stars: Yup.number().required("Please rate the ride"),
      comment: Yup.string(),
    }),

    onSubmit: (data) => {
      // Construct the request payload

      data.stars = Number(data.stars);
      data.comment = data.comment.trim();
      data.requestId = requestId;
      data.ratingId = userId + requestId;

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
            "Ride rating submission failed! - Edit Ride request status part " + err.response.data.message,
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
                    id="stars"
                    name="stars"
                    defaultValue={1}
                    max={5}
                    size="large"
                    value={formik.values.stars}
                    onChange={formik.handleChange}
                    error={formik.touched.stars && Boolean(formik.errors.stars)}
                    helperText={formik.touched.stars && formik.errors.stars}
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
