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
  const navigate = useNavigate();
  const [rideRequests, setRideRequests] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    const fetchRideRequests = async () => {
      try {
        const rideRequestsResponse = await http.get(
          `/riderequests/myrequests/${userId}/`
        );
        setRideRequests(rideRequestsResponse.data);
      } catch (error) {
        console.error("Failed to fetch ride requests:", error);
      }
    };
    fetchRideRequests();
  }, [userId]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await http.get("/riderequests/allratings");
        setRatings(response.data);
      } catch (error) {
        console.error("Failed to fetch ratings:", error);
      }
    };
    fetchRatings();
  }, []);

  const handleClick = () => {
    navigate("/riderequests/myrequests");
  };

  return (
    <Container maxWidth="xl" sx={{ marginTop: "2rem" }}>
      {/* ... (other JSX code) */}
      <AdminPageTitle title="All Ratings" backbutton />
      <Grid container spacing={3}>
        {ratings.length === 0 ? (
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
                sx={{ marginTop: "1rem" }}
              >
                View Rides
              </Button>
            </Paper>
          </Grid>
        ) : (
          ratings.map((rating) => {
            const correspondingRideRequest = rideRequests.find(
              (request) => request.requestId === rating.requestId
            );

            return (
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
                  <Grid xs={12} lg={12} spacing={1} item container>
                    <Grid item xs={6} sm={6}>
                      <InfoBox title="User ID" value={userId} />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <InfoBox
                        title="Date"
                        value={correspondingRideRequest?.date || ""}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <InfoBox
                        title="Time"
                        value={correspondingRideRequest?.time || ""}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <InfoBox
                        title="Pick Up"
                        value={correspondingRideRequest?.pickUp || ""}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <InfoBox
                        title="Destination"
                        value={correspondingRideRequest?.destination || ""}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            );
          })
        )}
      </Grid>
      <Box>&nbsp;</Box>
      {/* Pagination controls */}
      {/* ... (pagination controls) */}
    </Container>
  );
}
export default ViewAllRatings;
