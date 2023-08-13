import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Button,
  Grid,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import InfoBox from "../components/InfoBox";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import CancelIcon from "@mui/icons-material/Cancel";

function RideRequestCard({
  rideRequest,
  handleDetail,
  handleEdit,
  handleOpen,
  handleRate,
  handleOpenAbort,
}) {
  const { locationDetails } = rideRequest;
  const imageFile = locationDetails ? locationDetails.imageFile : null;
  return (
    <Card sx={{ maxWidth: 300 }}>
      <CardMedia
        component="img"
        height="140"
        image={
          import.meta.env.VITE_API_URL + "/admin/locations/images/" + imageFile
        }
        alt="Pick up location: Bishan"
      />
      <CardContent>
        <Grid container spacing={2} sx={{ marginY: "1rem" }}>
          <Grid xs={12} lg={12} spacing={1} item container>
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

            {rideRequest.status === "Accepted" && (
              <Grid item xs={6} sm={6}>
                <Typography></Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleDetail(rideRequest.requestId)}
                >View More Details</Button>
              </Grid>
            )}
          </Grid>
        </Grid>
        <IconButton
          onClick={() => handleDetail(rideRequest.requestId)}
          title="View Request"
        >
          <Visibility />
        </IconButton>
        {!["Completed", "Rated", "Accepted"].includes(rideRequest.status) && (
          <IconButton
            onClick={() => handleEdit(rideRequest.requestId)}
            title="Edit Request"
          >
            <Edit />
          </IconButton>
        )}

        {!["Completed", "Rated", "Accepted"].includes(rideRequest.status) && (
          <IconButton
            onClick={() => handleOpen(rideRequest.requestId)}
            title="Delete Request"
          >
            <Delete />
          </IconButton>
        )}

        {rideRequest.status === "Accepted" && (
          <IconButton
            onClick={() =>
              handleOpenAbort(rideRequest.requestId, rideRequest.routeId)
            }
            title="Abort Request"
          >
            <CancelIcon />
          </IconButton>
        )}

        {rideRequest.status === "Completed" && (
          <IconButton
            onClick={() => handleRate(rideRequest.requestId)}
            title="Rate ride"
          >
            <StarHalfIcon />
          </IconButton>
        )}

        {/* {rideRequest.status === "Completed" && (
          <IconButton
            onClick={() => handleRate(rideRequest.requestId)}
            title="Rate ride"
          >
            <StarHalfIcon />
          </IconButton>
        )} */}
      </CardContent>
    </Card>
  );
}

export default RideRequestCard;
