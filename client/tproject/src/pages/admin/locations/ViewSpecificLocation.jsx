import React, { useEffect, useState } from "react";
import http from "../../../http";
import { useParams } from "react-router-dom";
import AdminPageTitle from "../../../components/AdminPageTitle";
import {
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Box,
  Container,
  CardMedia
} from "@mui/material";
import CardTitle from "../../../components/CardTitle";
import PlaceIcon from "@mui/icons-material/Place";
import InfoBox from "../../../components/InfoBox";

const LocationDetails = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [imageFile, setImage] = useState(null);

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = () => {
    http.get(`/admin/locations/${id}`).then((res) => {
      console.log(res.data);
      setLocation(res.data);
      setImage(res.data.imageFile);
      console.log(imageFile);
    });
  };

  if (!location) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="xl" sx={{ marginTop: "1rem" }}>
      <AdminPageTitle title="Location Details" subtitle={location.name} backbutton />
      <Card sx={{ margin: "auto" }}>
        <CardMedia
          sx={{ height: 300 }}
          image={import.meta.env.VITE_API_URL + "/admin/locations/images/" + imageFile}
          title="Image of the location"
        />

        <CardContent>
          <CardTitle
            title="Location Information"
            icon={<PlaceIcon color="text.secondary" />}
          />
          <Grid container spacing={2} sx={{ marginY: "1rem" }}>
            <Grid xs={12} lg={12} spacing={1} item container>
              <Grid item xs={6} sm={6}>
                {/* <Typography variant="body1" gutterBottom>
                  Name: {location.name}
                </Typography> */}

                <InfoBox title="Location name" value={location.name} />
              </Grid>

              <Grid item xs={6} sm={6}>
                {/* Display the image here */}
              </Grid>

              <Grid item xs={12} sm={6}>
                {/* <Typography variant="body1" gutterBottom>
                  Premium: {location.premium}
                </Typography> */}
                <InfoBox title="Premium" value={location.premium} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body1" gutterBottom>
                  <InfoBox
                    title="Status"
                    value={location.status ? "Active" : "Inactive"}
                    boolean={location.status}
                  />
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                {/* <Typography variant="body1" gutterBottom>
                  Arrivals: {location.arrivals}
                </Typography> */}
                <InfoBox title="Arrivals" value={location.arrivals} />
              </Grid>

              <Grid item xs={12} sm={6}>
                {/* <Typography variant="body1" gutterBottom>
                  Departures: {location.departures}
                </Typography> */}

                <InfoBox title="Departures" value={location.departures} />
              </Grid>

              <Grid item xs={12} sm={12}>
                {/* <Typography variant="body1" gutterBottom>
                  Notes: {location.notes}
                </Typography> */}

                <InfoBox title="Notes" value={location.notes} />
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LocationDetails;
