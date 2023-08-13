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
  IconButton,
  Button,
  Container,
  CardMedia,
} from "@mui/material";
import CardTitle from "../../components/CardTitle";
import PlaceIcon from "@mui/icons-material/Place";
import InfoBox from "../../components/InfoBox";
import DriverChatBox from "../../components/DriverChatBox";
import io from "socket.io-client";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const RideRequestDetails = () => {
  const { userId, requestId } = useParams();
  const [rideRequest, setRideRequest] = useState(null);
  const [route, setRoute] = useState(null);
  const [routeId, setRouteId] = useState(null);
  const [pickUpLocation, setPickUpLocation] = useState(null); // State to store pickUp location details
  const [imageFile, setImageFile] = useState(null);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Abortion modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  // Modal attributes
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    // border: "2px solid #888",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };
  // End of abortion modal

  // Edit, delete etc
  // Function to handle editing a ride request
  const handleEdit = (id) => {
    navigate(`/riderequests/${user?.id}/update/${id}`);
  };

  // Function to handle aborting a ride request
  const handleAbort = () => {
    http
      .post(`/driver/chat/${rideRequest.routeId}/message`, {
        message: "Rider has cancelled ride",
      })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
        enqueueSnackbar("Error sending message. " + err.response.data.message, {
          variant: "error",
        });
      });
    http
      .put(
        `/riderequests/abortrequest/requestId/${rideRequest.requestId}/routeId/${rideRequest.routeId}`
      )
      .then((res) => {
        console.log(res.data);
        // Update the ride request list after successful deletion
        handleClose(); // close modal upon successful delete
        navigate("/riderequests/myrequests");
      })
      .catch((error) => {
        console.error("Failed to update ride request:", error);
      });
  };

  // Function to handle Rating a specific request
  const handleRate = (id) => {
    // navigate(`/riderequests/myrequests/${user?.id}/${id}`);
    navigate(`/riderequests/completed/rate/user/${user?.id}/request/${id}`);
  };
  // End of edit, delete etc

  useEffect(() => {
    // Fetch route data on component mount
    console.log("Ride id for route fetching:", requestId);
    http
      .get(`/riderequests/routes/${requestId}`)
      .then((res) => {
        console.log("Route data:", res.data);
        setRoute(res.data);
      })
      .catch((err) => {
        console.error("Error:", err);
        // enqueueSnackbar("Failed to fetch route data!", {
        //   variant: "error",
        // });
      });
  }, [requestId]);

  useEffect(() => {
    if (rideRequest) {
      console.log("test reach driver");
      console.log("ride request", rideRequest);
      const newSocket = io.connect(import.meta.env.VITE_API_URL, {
        query: {
          token: localStorage.getItem("token"),
          room: `chat_${rideRequest?.routeId}`,
        },
      });
      setSocket(newSocket);
      console.log("socket data", socket);
      return () => newSocket.close();
    }
  }, [rideRequest]);

  useEffect(() => {
    console.log("sod", socket);
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
        setRouteId(res.data.routeId);
      });
  };

  const fetchLocationDetails = () => {
    http.get(`/admin/locations/${pickUpLocation}`).then((res) => {
      console.log(res.data);
      setImageFile(res.data.imageFile);
      console.log("Imagefile test:", imageFile);
    });
  };

  const calculatePrice = (route) => {
    const destinations = route.routes[0].destinationList.split("|");
    const numberOfDestinations = destinations.length - 1; // Minus one because of the split
    const pricePerPassenger = route.routes[0].total_cost / numberOfDestinations;

    // If there's only one destination, final price is just total cost divided by number of passengers
    if (numberOfDestinations === 1) {
      return pricePerPassenger;
    }

    const finalPrice = pricePerPassenger * rideRequest.numberOfPassengers;
    return finalPrice;
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
      <Grid container spacing={2}>
        <Grid item lg={rideRequest.status === "Accepted" ? 8 : 12}>
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
                  {["Accepted", "Completed", "Rated"].includes(rideRequest.status) && (
                    <Grid xs={12} lg={12} spacing={1} item container>
                      <Grid item xs={6} sm={6}>
                        {/* <InfoBox title="Price ($)" value={route.routes[0].total_cost} /> */}
                        <InfoBox
                          title="Price ($)"
                          value={calculatePrice(route)}
                        />
                      </Grid>

                      <Grid item xs={6} sm={6}>
                        <InfoBox
                          title="Duration"
                          value={route.routes[0].duration}
                        />
                      </Grid>

                      <Grid item xs={6} sm={6}>
                        <InfoBox
                          title="Distance"
                          value={route.routes[0].distance}
                        />
                      </Grid>

                      <Grid item xs={6} sm={6}>
                        <InfoBox
                          title="Destination(s)"
                          value={route.routes[0].destination}
                        />
                      </Grid>
                    </Grid>
                  )}

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
                    <InfoBox
                      title="Destination"
                      value={rideRequest.destination}
                    />
                  </Grid>

                  <Grid item xs={6} sm={6}>
                    <InfoBox
                      title="No. of Passengers"
                      value={rideRequest.numberOfPassengers}
                    />
                  </Grid>

                  <Grid item xs={6} sm={6}>
                    <InfoBox title="Status" value={rideRequest.status} />
                  </Grid>
                  <Grid item xs={12} sm={12}></Grid>
                  <Grid item xs={6} sm={6}></Grid>
                  {/* <IconButton
                    onClick={() => handleDetail(params.row.requestId)}
                    title="View Request"
                  >
                    <Visibility />
                  </IconButton> */}
                  {/* <IconButton
                    onClick={() => handleEdit(params.row.requestId)}
                    title="Edit Request"
                  >
                    <Edit />
                  </IconButton> */}
                  {rideRequest.status === "Accepted" && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        // handleDelete(params.row.requestId);
                        handleOpen();
                      }}
                      title="Abort Request"
                    >
                      Abort Request
                    </Button>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {rideRequest.status === "Accepted" && (
          <Grid item lg={4}>
            {socket && (
              <DriverChatBox
                socket={socket}
                route={rideRequest?.routeId}
                closed={false}
              ></DriverChatBox>
            )}
          </Grid>
        )}
      </Grid>

      {/* Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to abort ride request?
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              handleAbort();
            }}
          >
            Yes
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button onClick={handleClose} variant="contained" color="error">
            No
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default RideRequestDetails;
