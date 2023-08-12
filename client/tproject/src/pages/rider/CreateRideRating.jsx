import React from "react";
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

function CreateRideRating() {
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
            <Typography>Date: ...</Typography>
            <Typography>Time: ...</Typography>
            <Typography>Pick Up: ...</Typography>
            <Typography>Destination: ...</Typography>
            <Typography>Status: ...</Typography>
          </Paper>
        </Grid>

        {/* Rating and Comments */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <Paper elevation={3} sx={{ padding: "1.5rem" }}>
                <Typography variant="h5" gutterBottom>
                  Rate Your Ride
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography>Rating:</Typography>
                  <Rating name="rating" defaultValue={0} max={5} />
                </Box>
              </Paper>
            </Grid>

            <Grid item>
              <Paper elevation={3} sx={{ padding: "1.5rem" }}>
                <Typography variant="h5" gutterBottom>
                  Comments
                </Typography>
                <TextField
                  id="comments"
                  label="Enter your comments..."
                  multiline
                  fullWidth
                  rows={6}
                  variant="outlined"
                />
              </Paper>
            </Grid>

            <Grid item>
              <Button variant="contained" color="primary">
                Submit Rating
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CreateRideRating;
