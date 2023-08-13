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
  const PAGE_SIZE = 4; // Number of items to display per page
  const [currentPage, setCurrentPage] = useState(1);

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

  // Calculate the index of the first and last item on the current page
  const indexOfLastItem = currentPage * PAGE_SIZE;
  const indexOfFirstItem = indexOfLastItem - PAGE_SIZE;

  // Get the items for the current page
  const currentRatings = ratings.slice(indexOfFirstItem, indexOfLastItem);
  const currentRideRequests = rideRequest.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <Container maxWidth="xl" sx={{ marginTop: "2rem" }}>
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
          currentRatings.map((rating, index) => (
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
                      value={currentRideRequests[index]?.date || ""}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <InfoBox
                      title="Time"
                      value={currentRideRequests[index]?.time || ""}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <InfoBox
                      title="Pick Up"
                      value={currentRideRequests[index]?.pickUp || ""}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <InfoBox
                      title="Destination"
                      value={currentRideRequests[index]?.destination || ""}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>
      {/* Pagination controls */}
      {/* <div>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentRatings.length < PAGE_SIZE}
        >
          Next
        </button>
      </div> */}
      <Box mt={3} textAlign="center">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>{" "}
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentRatings.length < PAGE_SIZE}
        >
          Next
        </Button>
      </Box>
      <Box>&nbsp;</Box>
    </Container>
  );
}

export default ViewAllRatings;
