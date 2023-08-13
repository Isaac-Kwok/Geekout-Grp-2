import React from "react";
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Rating,
  Divider,
  TextField,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import ReviewsIcon from "@mui/icons-material/Reviews";
import { PieChart } from "@mui/x-charts";
import AdminPageTitle from "../../components/AdminPageTitle";
import http from "../../http";
import useUser from "../../context/useUser";

function DriverReviews() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentStars, setCurrentStars] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewStars, setreviewStars] = useState([]);
  const [averageStars, setaverageStars] = useState(0);
  const [reviews, setreviews] = useState([]);
  const { user, refreshUser } = useUser();
  const [filteredReviews, setFilteredReviews] = useState([]); // New state for filtered reviews


  const reviewsPerPage = 6; // Number of reviews to show per page
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const pagedReviews = filteredReviews.slice(startIndex, endIndex);
  
  const handleGetReviews = async () => {
    try {
      const res = await http.get("/driver/review/" + user.id);
      if (res.status === 200) {
        console.log("reviews", res.data);
        setreviews(res.data);
      }
    } catch (error) {
      console.error("Error fetching ride requests:", error);
    }
  };
  function calculatereviewStars(inputList) {
    const reviewStars = [
      { id: 0, value: 0, label: "1 stars", color: "#FFBB28" },
      { id: 1, value: 0, label: "2 stars", color: "#00C49F" },
      { id: 2, value: 0, label: "3 stars", color: "#FF8042" },
      { id: 2, value: 0, label: "4 stars", color: "blue" },
      { id: 2, value: 0, label: "5 stars", color: "yellow" },
    ];
    let total = 0;

    inputList.forEach((review) => {
      const reviewStarsNo = review.rating;
      total += reviewStarsNo;
      if (reviewStarsNo == 1) {
        reviewStars[0].value += 100 / inputList.length;
      } else if (reviewStarsNo == 2) {
        reviewStars[1].value += 100 / inputList.length;
      } else if (reviewStarsNo == 3) {
        reviewStars[2].value += 100 / inputList.length;
      } else if (reviewStarsNo == 4) {
        reviewStars[3].value += 100 / inputList.length;
      } else if (reviewStarsNo == 5) {
        reviewStars[4].value += 100 / inputList.length;
      }
    });
    setaverageStars((total / inputList.length).toFixed(1));
    setreviewStars(reviewStars);
    return reviewStars;
  }

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    const lowerSearchQuery = searchQuery.toLowerCase();

    const filtered = reviews.filter((review) => {
      const routeIdMatch = review.routeId.toString().includes(lowerSearchQuery);
      const commentMatch = review.comment.toLowerCase().includes(lowerSearchQuery);
      return routeIdMatch || commentMatch;
    });

    setFilteredReviews(filtered);
    setCurrentPage(1); // Reset current page to 1
  };

  useEffect(() => {
    if (user) {
      handleGetReviews();
    }
  }, [user]);

  useEffect(() => {
    calculatereviewStars(reviews);
    // When reviews change, apply search filter if searchQuery is not empty
    if (searchQuery !== "") {
      handleSearch();
    } else {
      setFilteredReviews(reviews);
    }
  }, [reviews, searchQuery]);

  return (
    <Container maxWidth="lg" sx={{ marginBottom: 8 }}>
      <AdminPageTitle title="Review Statistics" backbutton />
      <Grid container spacing={2} sx={{ marginBottom: 2, marginTop: 3 }}>
        <Grid item lg={4}>
          <Card>
            <CardContent>
              <Stack
                alignItems="flex-start"
                direction="row"
                justifyContent="space-between"
                spacing={3}
              >
                <Stack spacing={1}>
                  <Typography color="text.secondary" variant="h5">
                    Average Review Rating
                  </Typography>
                  <Typography variant="h4">{averageStars} Stars</Typography>
                </Stack>
                <Avatar
                  sx={{
                    backgroundColor: "#ffc107",
                    height: 56,
                    width: 56,
                  }}
                >
                  <ReviewsIcon></ReviewsIcon>
                </Avatar>
              </Stack>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ marginTop: "0.5rem" }}
              >
                This displays the average reviews rating you have based on your
                total reviews accross all routes and rides accpeted.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item lg={8} sx={{ marginBottom: "2rem" }}>
          <PieChart
            series={[
              {
                data: reviewStars,
              },
            ]}
            height={220}
            sx={{
              "--ChartsLegend-rootOffsetX": "-5rem",
              padding: 0,
            }}
          />
        </Grid>
        <Grid item lg={6}>
            {/* Search Bar here */}
            <TextField
            label="Search by Route ID or Comment"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            margin="normal"
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {pagedReviews.map((review, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Route: {review.routeId}</Typography>
                <Rating
                  name={`rating-${review.reviewer}`}
                  value={review.rating}
                  readOnly
                />
                <Typography variant="body2" color="textSecondary">
                  Comment: {review.comment}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={Math.ceil(filteredReviews.length / reviewsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ marginTop: 3, display: "flex", justifyContent: "center" }}
      />
    </Container>
  );
}
export default DriverReviews;
