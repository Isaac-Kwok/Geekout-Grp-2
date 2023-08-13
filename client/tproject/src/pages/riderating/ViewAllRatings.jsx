import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Rating,
  Button,
} from "@mui/material";
import AdminPageTitle from "../../components/AdminPageTitle";
import http from "../../http";
import { useNavigate, useParams } from "react-router-dom";
import InfoBox from "../../components/InfoBox";

function ViewAllRatings() {
  const [ratings, setRatings] = useState([]);
  const navigate = useNavigate;
  const [rideRequest, setRideRequest] = useState([]);
  const [PickUpLocation, setPickUpLocation] = useState(null);
  const [routeId, setRouteId] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    const fetchRideRequest = () => {
      http.get(`/riderequests/myrequests/${userId}/`).then((res) => {
        console.log(res.data);
        setRideRequest(res.data);
        setPickUpLocation(res.data.pickUp);
        setRouteId(res.data.routeId);
      });
    };
    fetchRideRequest();
  }, []);

  useEffect(() => {
    // Fetch the ratings from the server using an HTTP request
    const fetchRatings = async () => {
      try {
        const response = await http.get("/riderequests/allratings"); // Assuming this endpoint fetches all ratings
        setRatings(response.data);
        console.log(response.data); // Check that ratings are correctly fetched
      } catch (error) {
        console.error("Failed to fetch ratings:", error);
      }
    };
    fetchRatings();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ marginTop: "2rem" }}>
      <AdminPageTitle title="All Ratings" backbutton />
      <Grid container spacing={3}>
        {ratings.length === 0 && (
          <Grid container justifyContent="center" alignItems="center" xs={12}>
            <Paper
              elevation={3}
              sx={{ padding: "1.5rem", textAlign: "center" }}
            >
              <Typography variant="body1">
                You have not made any ride ratings.
              </Typography>
              <Button
                variant="contained"
                color="success"
                onClick={() => navigate(`/riderequests/myrequests`)}
                sx={{ marginTop: "1rem" }} // Add margin to separate the button from the text
              >
                View Rides
              </Button>
            </Paper>
          </Grid>
        )}
        {ratings.map((rating, index) => (
        <Grid key={rating.id} item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: "1.5rem" }}>
            <Typography variant="h5" gutterBottom>
              Rating Details
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1" fontWeight="bold">
                Rating:&nbsp;
              </Typography>
              <Rating value={rating.rating} readOnly />
            </Box>
            <Typography variant="body1" fontWeight={"bold"}>
              Comment:
            </Typography>
            <Typography>{rating.comment || "No comment"}</Typography>
            <Box>&nbsp;</Box>
            {/* Add more fields here as needed */}
            
            <InfoBox title="User ID" value={userId} />
            <InfoBox title="Date" value={rideRequest[index].date} />
            <InfoBox title="Time" value={rideRequest[index].time} />
            <InfoBox title="Pick Up" value={rideRequest[index].pickUp} />
            <InfoBox title="Destination" value={rideRequest[index].destination} />
          </Paper>
        </Grid>
      ))}
      </Grid>
    </Container>
  );
}

export default ViewAllRatings;
