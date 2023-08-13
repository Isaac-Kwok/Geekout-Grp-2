import React from 'react'
import { useState, useEffect } from 'react'
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
  Stack
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import ReviewsIcon from '@mui/icons-material/Reviews';
import { PieChart } from '@mui/x-charts';
import AdminPageTitle from '../../components/AdminPageTitle';


const reviewsData = [
  {
    id: 1,
    routeNumber: 'Route 101',
    reviewer: 'John Doe',
    date: 'July 20, 2023',
    rating: 5,
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit purus id leo convallis, id auctor enim venenatis.',
  },
  {
    id: 1,
    routeNumber: 'Route 101',
    reviewer: 'John Doe',
    date: 'July 20, 2023',
    rating: 3,
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit purus id leo convallis, id auctor enim venenatis.',
  },
  {
    id: 1,
    routeNumber: 'Route 101',
    reviewer: 'John Doe',
    date: 'July 20, 2023',
    rating: 2,
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit purus id leo convallis, id auctor enim venenatis.',
  },
  {
    id: 1,
    routeNumber: 'Route 101',
    reviewer: 'John Doe',
    date: 'July 20, 2023',
    rating: 1,
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit purus id leo convallis, id auctor enim venenatis.',
  },
  {
    id: 1,
    routeNumber: 'Route 101',
    reviewer: 'John Doe',
    date: 'July 20, 2023',
    rating: 5,
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit purus id leo convallis, id auctor enim venenatis.',
  }, {
    id: 1,
    routeNumber: 'Route 101',
    reviewer: 'John Doe',
    date: 'July 20, 2023',
    rating: 3,
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit purus id leo convallis, id auctor enim venenatis.',
  },
  {
    id: 1,
    routeNumber: 'Route 101',
    reviewer: 'John Doe',
    date: 'July 20, 2023',
    rating: 2,
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit purus id leo convallis, id auctor enim venenatis.',
  },
  {
    id: 1,
    routeNumber: 'Route 101',
    reviewer: 'John Doe',
    date: 'July 20, 2023',
    rating: 4,
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit purus id leo convallis, id auctor enim venenatis.',
  }, {
    id: 1,
    routeNumber: 'Route 101',
    reviewer: 'John Doe',
    date: 'July 20, 2023',
    rating: 4,
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit purus id leo convallis, id auctor enim venenatis.',
  },
]
const reviewsPerPage = 6; // Number of reviews to show per page
function DriverReviews() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStars, setCurrentStars] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewStars, setreviewStars] = useState([])
  const [averageStars, setaverageStars] = useState(0)

  function calculatereviewStars(inputList) {
    const reviewStars = [
      { id: 0, value: 0, label: '1 stars', color: "#FFBB28" },
      { id: 1, value: 0, label: '2 stars', color: "#00C49F" },
      { id: 2, value: 0, label: '3 stars', color: "#FF8042" },
      { id: 2, value: 0, label: '4 stars', color: "blue" },
      { id: 2, value: 0, label: '5 stars', color: "yellow" },
    ];
    let total = 0

    inputList.forEach((review) => {
      const reviewStarsNo = review.rating;
      total += reviewStarsNo
      if (reviewStarsNo == 1) {
        reviewStars[0].value += 100 / inputList.length;
      } else if (reviewStarsNo == 2) {
        reviewStars[1].value += 100 / inputList.length;
      }
      else if (reviewStarsNo == 3) {
        reviewStars[2].value += 100 / inputList.length;
      }
      else if (reviewStarsNo == 4) {
        reviewStars[3].value += 100 / inputList.length;
      }
      else if (reviewStarsNo == 5) {
        reviewStars[4].value += 100 / inputList.length;
      }
    });
    setaverageStars((total/inputList.length).toFixed(1))
    setreviewStars(reviewStars)
    return reviewStars;
  }

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset page when searching
  };

  const handleStarsChange = (event) => {
    setCurrentStars(event.target.value);
    setCurrentPage(1); // Reset page when changing filter
  };

  const filteredReviews = reviewsData.filter((review) => {
    const matchesSearch = review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.routeNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStars = currentStars === 'all' || review.rating === parseInt(currentStars);

    return matchesSearch && matchesStars;
  });

  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentReviews = filteredReviews.slice(startIndex, endIndex);

  useEffect(() => {
    calculatereviewStars(reviewsData);
  }, [])

  return (
    <Container maxWidth="lg" sx={{ marginBottom: 8 }} >
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
                  <Typography
                    color="text.secondary"
                    variant="h5"
                  >
                    Average Review Rating
                  </Typography>
                  <Typography variant="h4">
                    {averageStars} Stars
                  </Typography>
                </Stack>
                <Avatar
                  sx={{
                    backgroundColor: '#ffc107',
                    height: 56,
                    width: 56
                  }}
                >
                  <ReviewsIcon></ReviewsIcon>
                </Avatar>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ marginTop: '0.5rem' }}>
                This displays the average reviews rating you have based on your total reviews accross all routes and rides accpeted.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item lg={8} sx={{ marginBottom: '2rem' }}>
          <PieChart
            series={[
              {
                data: reviewStars,
              },
            ]}
            height={220}
            sx={{
              "--ChartsLegend-rootOffsetX": "-5rem",
              padding: 0

            }}

          />
        </Grid>
        <Grid item lg={6}>
          <TextField
            label="Search Reviews"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ marginBottom: 2 }}
          />
        </Grid>
        <Grid item lg={4}>
          <Select
            label="Filter by Stars"
            variant="outlined"
            value={currentStars}
            onChange={handleStarsChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            <MenuItem value="all">All Stars</MenuItem>
            <MenuItem value="1">1 Star</MenuItem>
            <MenuItem value="2">2 Stars</MenuItem>
            <MenuItem value="3">3 Stars</MenuItem>
            <MenuItem value="4">4 Stars</MenuItem>
            <MenuItem value="5">5 Stars</MenuItem>
          </Select>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {currentReviews.map((review, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Route: {review.routeNumber}</Typography>
                <Rating
                  name={`rating-${index}`}
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
        sx={{ marginTop: 3, display: 'flex', justifyContent: 'center' }}
      />
    </Container>
  );
};
export default DriverReviews