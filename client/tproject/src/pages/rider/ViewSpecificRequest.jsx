import React, { useEffect, useState } from "react";
import http from "../../http";
import { useParams } from "react-router-dom";
import AdminPageTitle from "../../components/AdminPageTitle";
import {
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Box,
  Container,
  CardMedia,
} from "@mui/material";
import CardTitle from "../../components/CardTitle";
import PlaceIcon from "@mui/icons-material/Place";
import InfoBox from "../../components/InfoBox";

const RideRequestDetails = () => {
  const { userId, requestId } = useParams();
  const [rideRequest, setRideRequest] = useState(null);
  const [pickUpLocation, setPickUpLocation] = useState(null); // State to store pickUp location details
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchRideRequest();
  }, []);

  useEffect(() => {
    if (pickUpLocation) {
      // Fetch location details and imageFile after pickUpLocation is set
      fetchLocationDetails();
    }
  }, [pickUpLocation]);

  const fetchRideRequest = () => {
    http
      .get(`/riderequests/myrequests/${userId}/specific/${requestId}`)
      .then((res) => {
        console.log(res.data);
        setRideRequest(res.data);
        setPickUpLocation(res.data.pickUp);
      });
  };

  const fetchLocationDetails = () => {
    http.get(`/admin/locations/${pickUpLocation}`).then((res) => {
      console.log(res.data);
      setImageFile(res.data.imageFile);
      console.log("Imagefile test:", imageFile);
    });
  };

  if (!rideRequest || !imageFile) {
    // Check for imageFile instead of pickUpLocation
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="xl" sx={{ marginTop: "1rem" }}>
      <AdminPageTitle
        title="Ride Request Details"
        subtitle={`Ride Request ID: ${rideRequest.requestId}`}
        backbutton
      />
      <Card sx={{ margin: "auto" }}>
        {/* Add the image here using CardMedia */}
        <CardMedia
          sx={{ height: 300 }}
          image={
            import.meta.env.VITE_API_URL +
            "/admin/locations/images/" +
            imageFile
          }
          title="Image of the location"
        />
        <CardContent>
          <CardTitle
            title="Ride Request Information"
            icon={<PlaceIcon color="text.secondary" />}
          />
          <Grid container spacing={2} sx={{ marginY: "1rem" }}>
            <Grid xs={12} lg={12} spacing={1} item container>
              <Grid item xs={6} sm={6}>
                <InfoBox title="User ID" value={rideRequest.userId} />
              </Grid>

              <Grid item xs={6} sm={6}>
                <InfoBox title="Date" value={rideRequest.date} />
              </Grid>

              <Grid item xs={6} sm={6}>
                <InfoBox title="Time" value={rideRequest.time} />
              </Grid>

              <Grid item xs={6} sm={6}>
                <InfoBox title="Pick Up" value={rideRequest.pickUp} />
              </Grid>

              <Grid item xs={6} sm={6}>
                <InfoBox title="Destination" value={rideRequest.destination} />
              </Grid>

              <Grid item xs={6} sm={6}>
                <InfoBox title="Status" value={rideRequest.status} />
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RideRequestDetails;
