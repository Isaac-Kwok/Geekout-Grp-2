import React from 'react'
import { GoogleMap, MarkerF, useJsApiLoader, DirectionsRenderer, Autocomplete, } from "@react-google-maps/api";
import { Button, Container, Grid, Card, CardContent, Box, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useState, useRef, useEffect } from "react";
import googleMapsReverseGeocoder from '../../googleMapsReverseGeocoder'
import googleMapsDecisionMatrix from '../../googleMapsDecisionMatrix'
import http from '../../http'
import useUser from '../../context/useUser';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { CatchingPokemonSharp } from '@mui/icons-material';



function DriverRouting() {
  const navigate = useNavigate()
  const [latitude, setlatitude] = useState(1.3521)
  const [longtitude, setlongtitude] = useState(103.8198)
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_DRIVER_GOOGLE_API_KEY,
    libraries: ['places'],
  })
  const center = { lat: latitude, lng: longtitude };
  const [map, setMap] = useState(null)
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [profit, setprofit] = useState('')
  const [duration, setDuration] = useState('')
  const [visibleRoutes, setVisibleRoutes] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [renderCount, setRenderCount] = useState(1);
  const [routeObj, setrouteObj] = useState({ names: " ", wayPoints: [] })
  const [destination, setdestination] = useState('Singapore')
  const [open, setOpen] = useState(false);
  const { user, refreshUser } = useUser();
  const [geolocationFetched, setGeolocationFetched] = useState(false);
  const originRef = useRef({})
  const destinationRef = useRef({})
  const isDataFetched = useRef(false); // useRef to track whether data has been fetched

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleGetRideRequests = async () => {
    try {
      const res = await http.get("/riderequests/allrequests");
      if (res.status === 200) {
        const ridesList = res.data;
        const maxRidesPerList = 3; // Adjust the value as desired

        // Group the rides based on pickUp location
        const groupedRides = groupObjectsByPickUp(ridesList);
        const updatedGroupedRides = splitListsIfNeeded(groupedRides);
        const listsOfRoutes = await createSummaryList(updatedGroupedRides);

        // Now set the grouped rides in the state
        setVisibleRoutes(listsOfRoutes);
        isDataFetched.current = true; // Mark data as fetched
      }
    } catch (error) {
      console.error("Error fetching ride requests:", error);
    }
  };
  function groupObjectsByPickUp(data) {
    const groupedData = {};

    for (const ride of data) {
      const pickUpLocation = ride.pickUp;

      if (groupedData[pickUpLocation]) {
        groupedData[pickUpLocation].push(ride);
      } else {
        groupedData[pickUpLocation] = [ride];
      }
    }

    // Convert the object values to an array to get the final grouped list
    const groupedList = Object.values(groupedData);
    return groupedList;
  }

  function splitListsIfNeeded(groupedData) {
    const updatedGroupedData = [];

    for (const group of groupedData) {
      if (group.length > 3) {
        while (group.length > 3) {
          const newGroup = group.splice(3);
          updatedGroupedData.push(newGroup);
        }
      }
      updatedGroupedData.push(group);
    }

    return updatedGroupedData;
  }



  async function createSummaryList(groupedRides) {
    const summaryList = [];

    // Iterate through each group of rides with the same pickUp location
    for (const rideGroup of groupedRides) {
      const pickUpLocation = rideGroup[0].pickUp;
      const destinationList = [pickUpLocation];
      const wayPoints = []; // Create a new waypoints array for each group

      // Populate the waypoints array for the current group
      for (const ride of rideGroup) {
        destinationList.push(ride.destination);
      }

      let result = await decisionMatrix(pickUpLocation, destinationList);
      result.forEach(location => {
        const wayPoint = {
          location: location,
          stopover: true,
        };
        wayPoints.push(wayPoint);
      });
      wayPoints.pop()

      // Get the destination from the last waypoint


      // Extract the names from the rides in the group
      const names = rideGroup.map((ride) => ride.name);

      // Convert the rideIds array to a comma-separated string
      const rideIds = rideGroup.map((ride) => ride.requestId).join(', ');

      // Create the summary object and add it to the summaryList
      const summaryObject = {
        pickUp: pickUpLocation,
        wayPoints: wayPoints,
        names: names,
        destinationList: result,
        destination: result[result.length - 1], // Add the destination attribute
        rideIds: rideIds, // Add the rideIds attribute as a string
      };

      summaryList.push(summaryObject);
    }

    return summaryList;
  }


  const handleDelete = (index) => {
    const newRoutes = visibleRoutes.filter((_, i) => i !== index);
    setVisibleRoutes(newRoutes);
  };



  async function showPosition(position) {
    setlatitude(position.coords.latitude);
    setlongtitude(position.coords.longitude);

    googleMapsReverseGeocoder
      .get(
        'json?latlng=' +
        position.coords.latitude +
        ',' +
        position.coords.longitude +
        '&key=' +
        import.meta.env.VITE_DRIVER_GOOGLE_API_KEY
      )
      .then((res) => {
        if (res.status === 200) {
          originRef.current.value = res.data.results[0].formatted_address;
          console.log('address', originRef.current.value);
          setGeolocationFetched(true); // Mark that geolocation data has been fetched
        } else {
          console.log('Address retrieval failed', res.status);
        }
      });
  }
  const decisionMatrix = async (origin, destinations) => {
    const newObj = {
      origin: origin,
      destinations: destinations
    };

    try {
      const res = await http.post("/driver/getDistanceMatrix", newObj);
      if (res.status === 200) {
        const result = orderDestinationsByDistance(res.data);
        console.log('res data:', result);
        return result; // Add the return statement here
      } else {
        console.log("Failed to get Distance matrix:", res.status);
      }
    } catch (err) {
      alert("ERROR:" + JSON.stringify(err.responseJSON.error));
    }
  };


  function orderDestinationsByDistance(data) {
    // Extract the distance values and destination addresses from the JSON object
    const distances = data.rows[0].elements.map((element) => element.distance.value);
    const destinations = data.destination_addresses;

    // Create an array of objects with distance and destination pairs
    const distanceDestinationPairs = distances.map((distance, index) => ({
      distance: distance,
      destination: destinations[index],
    }));

    // Sort the array based on distance values in ascending order
    distanceDestinationPairs.sort((a, b) => a.distance - b.distance);

    // Extract the sorted destination addresses
    const sortedDestinations = distanceDestinationPairs.map((pair) => pair.destination);

    return sortedDestinations;
  }



  const calculateRoute = async () => {
    try {
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        waypoints: [{
          location: 'wisteria mall singapore',
          stopover: true,
        },
        {
          location: 'Ang Mo kio hub singapore',
          stopover: true,
        }],

        optimizeWaypoints: true,
        provideRouteAlternatives: true,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      });

      // Calculate total distance and duration
      let totalDistance = 0;
      let totalDuration = 0;

      for (const leg of results.routes[0].legs) {
        totalDistance += leg.distance.value;
        totalDuration += leg.duration.value;
      }

      // Convert totalDistance and totalDuration to human-readable format if needed
      const formattedTotalDistance = `${totalDistance / 1000} km`;
      const formattedTotalDuration = `${Math.floor(totalDuration / 60)} mins`;

      console.log('total distacne:', totalDistance)

      setDirectionsResponse(results);
      setDistance(formattedTotalDistance);
      setDuration(formattedTotalDuration);
      setprofit((((totalDistance / 1000) * 2) * 0.65).toFixed(2))

      console.log('total distacne:', distance)

    } catch (error) {
      console.error('Error calculating route:', error);
      // Handle the error here, e.g., display an error message or take appropriate action
      enqueueSnackbar("Please input a start destination", { variant: "error" });
    }
  };



  const configureDestination = async (waypoints, destination) => {
    try {
      console.log(waypoints)
      console.log(destination)
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destination,
        waypoints: waypoints,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      });

      // Calculate total distance and duration
      let totalDistance = 0;
      let totalDuration = 0;

      for (const leg of results.routes[0].legs) {
        totalDistance += leg.distance.value;
        totalDuration += leg.duration.value;
      }

      // Convert totalDistance and totalDuration to human-readable format if needed
      const formattedTotalDistance = `${totalDistance / 1000} km`;
      const formattedTotalDuration = `${Math.floor(totalDuration / 60)} mins`;

      setDirectionsResponse(results);
      setDistance(formattedTotalDistance);
      setDuration(formattedTotalDuration);
      setprofit((((totalDistance / 1000) * 2) * 0.65).toFixed(2))

      return {
        directions: directionsResponse,
        distance: formattedTotalDistance,
        distanceValue: totalDistance,
        duration: formattedTotalDuration,
      };
    } catch (error) {
      console.error('Error configuring destination:', error);
      // Handle the error here, e.g., display an error message or take appropriate action
      enqueueSnackbar("Please input a start destination", { variant: "error" });
    }
  };



  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    if (destinationRef.current.value) {
      destinationRef.current.value = ''
    }

  }

  const storeRoute = async (originalObj, wayPoints, destination) => {
    try {
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destination,
        waypoints: wayPoints,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      });

      // Calculate total distance and duration
      let totalDistance = 0;
      let totalDuration = 0;

      for (const leg of results.routes[0].legs) {
        totalDistance += leg.distance.value;
        totalDuration += leg.duration.value;
      }

      // Convert totalDistance and totalDuration to human-readable format if needed
      const formattedTotalDistance = `${totalDistance / 1000} km`;
      const formattedTotalDuration = `${Math.floor(totalDuration / 60)} mins`;

      const newObj = { ...originalObj };
      console.log('test', newObj)
      // Convert wayPoints array to a string
      newObj.wayPoints = newObj.wayPoints
        .map(wayPoint => `${wayPoint.location}`)
        .join(', ');

      newObj.destinationList = newObj.destinationList
        .map(destination => `${destination}`)
        .join(',');
      // Convert names array to a string
      newObj.names = newObj.names.map(name => (name !== null ? name.toString() : 'null')).join(', ');

      // Convert destination to a string
      newObj.destination = newObj.destination.toString();
      newObj.distance = formattedTotalDistance
      newObj.distance_value = totalDistance
      newObj.duration = formattedTotalDuration
      newObj.driver_profit = (((totalDistance / 1000) * 2) * 0.65)
      newObj.company_profit = (((totalDistance / 1000) * 2) * 0.35)
      newObj.total_cost = ((totalDistance / 1000) * 2)
      newObj.rideDirections = results

      console.log('new:', newObj);

      http.post("/driver/createRoute", newObj)
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data);
            refreshUser()
            setrouteObj(user.current_route)
            enqueueSnackbar('You have accepted Route!', { variant: 'success' });
          } else {
            console.log("Failed to create routes:", res.status);
          }
        })
        .catch((err) => {
          alert("ERROR:" + JSON.stringify(err.responseJSON.error));
        });
    } catch (error) {
      console.error('Error storing route:', error);
      enqueueSnackbar("Error storing route", { variant: "error" });
    }
  };

  const handleAbort = () => {
    handleClose()
    // delete route from DB
    http.delete("/driver/route/" + user.current_route.id)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
        } else {
          console.log("Failed to abort routes:", res.status);
        }
      })
      .catch((err) => {
        console.error("Error deleting route:", err);
        // Handle the error here, e.g., display an error message or take appropriate action
      });

    // updating the driver status
    http.put("/driver/abort")
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          refreshUser();
          enqueueSnackbar('You have aborted Route!', { variant: 'warning' });
        } else {
          console.log("Failed to abort routes:", res.status);
        }
      })
      .catch((err) => {
        console.error("Error updating driver status:", err);
        // Handle the error here, e.g., display an error message or take appropriate action
      });
    clearRoute()
  };

  const handleComplete = (routeObj) => {
    // delete Ride requests from DB
    console.log(
      routeObj
    )
    const rideIdsList = routeObj.rideIds.split(","); // Split the string by commas
    for (let index = 0; index < rideIdsList.length; index++) {
      const rideId = rideIdsList[index];
      http.delete("/driver/ride/" + rideId)
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data);
          } else {
            console.log("Failed to delete rides:", res.status);
          }
        })
        .catch((err) => {
          console.error("Error deleting rides:", err);
          // Handle the error here, e.g., display an error message or take appropriate action
        });
    }
    http.put("/driver/complete")
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          refreshUser();
          enqueueSnackbar('You have Completed Route!', { variant: 'success' });
        } else {
          console.log("Failed to complete routes:", res.status);
        }
      })
      .catch((err) => {
        console.error("Error updating driver status:", err);
        // Handle the error here, e.g., display an error message or take appropriate action
      });
    refreshUser()
    handleGetRideRequests()
    navigate('/driver/routes')
  }

  useEffect(() => {
    refreshUser()
    console.log('user', user)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
    if (renderCount === 1) {
      setRenderCount(2);
    }
    // Call the function to fetch and group the rides
    handleGetRideRequests();
    console.log('routes:', visibleRoutes)
  }, [renderCount]);

  return (
    <>
      {!isLoaded && !geolocationFetched && <div>Loading...</div>}
      {isLoaded && geolocationFetched && user?.on_duty === false &&
        <Box sx={{
          border: 'solid, black',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Container maxWidth="xl" sx={{ marginTop: '2rem' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={9} md={7} sm={12}>

                <GoogleMap
                  center={center}
                  zoom={15}
                  mapContainerStyle={{ width: '100%', height: '100%', minHeight: '700px' }}
                  options={{
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                  }}
                  onLoad={map => setMap(map)}

                >

                  {directionsResponse && (
                    <DirectionsRenderer directions={directionsResponse} />
                  )}
                  <MarkerF position={center} />
                </GoogleMap>
              </Grid>

              <Grid id='browseRoutes' item xs={12} lg={3} md={5} sm={12} >
                <Card sx={{ marginBottom: '1rem' }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <h3 style={{ margin: 0 }}>Chosen Route Stats: </h3>
                        <p style={{ margin: 0 }}>Click on any of the route requests and their respective stats will be displayed</p>
                      </Grid>
                      <Grid item xs={6}>
                        {distance && (
                          <h5 style={{ margin: 0 }}>Distance: {distance}</h5>
                        )}
                      </Grid>
                      <Grid item xs={6} >
                        {duration && (
                          <h5 style={{ margin: 0 }}>Duration: {duration}</h5>
                        )}
                      </Grid>
                      <Grid item xs={6} >
                        {profit && (
                          <h4 style={{ margin: 0, color: 'green' }}>Profit: ${profit}</h4>
                        )}
                      </Grid>
                    </Grid>
                    <hr />
                    <br />
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Button variant='contained' color='secondary' onClick={clearRoute}>
                          Clear
                        </Button>
                      </Grid>
                      <Grid item xs={8} >
                        <h4 style={{ margin: 0 }}>Set Custom route</h4>
                      </Grid>
                    </Grid>

                    <Autocomplete>
                      <TextField
                        fullWidth
                        name='name'
                        margin="normal" autoComplete="off"
                        label="Current Location"
                        inputRef={originRef}
                        defaultValue={originRef.current?.value}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Autocomplete>

                    <Autocomplete>
                      <TextField
                        fullWidth
                        margin="normal" autoComplete="off"
                        label="Destination"
                        inputRef={destinationRef}
                      />
                    </Autocomplete>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Button variant='contained' onClick={calculateRoute}>Directions</Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          variant='contained' color='error'
                          onClick={() => {
                            map.panTo(center)
                            map.setZoom(15)
                          }}
                        >
                          Recenter
                        </Button>
                      </Grid>
                    </Grid>

                  </CardContent>
                </Card>
                <div className="div" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {visibleRoutes.map((routeObj, index) => (
                    <Card key={index} style={{ marginBottom: '10px' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          <b>Pick Up:</b> {routeObj.pickUp}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <b>Riders:</b> {routeObj.names.join(', ')}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <b>Destinations:</b>
                          {routeObj.destinationList.map((destination, i) => (
                            <li key={i}>
                              {destination}
                            </li>
                          ))}
                        </Typography>


                        <Grid container spacing={0} sx={{ marginTop: 1 }}>
                          <Grid item xs={4} >
                            <Button
                              variant='contained' onClick={() => configureDestination(routeObj.wayPoints, routeObj.destination)} >
                              Direct
                            </Button>
                          </Grid>
                          <Grid item xs={4} >
                            <Button
                              variant='contained' color='success'
                              onClick={() => storeRoute(routeObj, routeObj.wayPoints, routeObj.destination)}
                            >
                              Accept
                            </Button>
                          </Grid>
                          <Grid item xs={4} >
                            <Button
                              onClick={() => handleDelete(index)}
                              variant='contained' color='error'
                            >
                              Reject
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Grid>
            </Grid>
          </Container>
        </Box>
      }
      {isLoaded && geolocationFetched && user?.on_duty === true &&
        <Box sx={{
          border: 'solid, black',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Container maxWidth="xl" sx={{ marginTop: '2rem' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={9} md={7} sm={12}>

                <GoogleMap
                  center={center}
                  zoom={15}
                  mapContainerStyle={{ width: '100%', height: '100%', minHeight: '700px' }}
                  options={{
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                  }}
                  onLoad={map => setMap(map)}

                >

                  {user.rideDirections && (
                    <DirectionsRenderer directions={JSON.parse(user.rideDirections)} panel={document.getElementById('instructions')} />
                  )}
                  <MarkerF position={center} />
                </GoogleMap>
              </Grid>
              <Grid id='route' item xs={12} lg={3} md={5} sm={12} >

                <div id="instructions" style={{ maxHeight: '500px', overflowY: 'auto' }}></div>
                <Card style={{ marginBottom: '10px' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <b>Route ID:</b> {user.current_route.id}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      <b>Pick Up:</b> {user.current_route.pickUp}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <b>Riders:</b> {user.current_route.names}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <b>Destinations:</b> {user.current_route.destinationList}
                    </Typography>
                    <hr />
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <h3 style={{ margin: 0 }}>Chosen Route Stats: </h3>
                        <p style={{ margin: 0 }}>These are the stats for route: {user.current_route.id}</p>
                      </Grid>
                      <Grid item xs={6}>
                        {user.current_route.distance && (
                          <h5 style={{ margin: 0 }}>Distance: {user.current_route.distance}</h5>
                        )}
                      </Grid>
                      <Grid item xs={6} >
                        {user.current_route.distance && (
                          <h5 style={{ margin: 0 }}>Duration: {user.current_route.duration}</h5>
                        )}
                      </Grid>
                      <Grid item xs={6} >
                        {user.current_route.driver_profit && (
                          <h4 style={{ margin: 0, color: 'green' }}>Profit: ${user.current_route.driver_profit.toFixed(2)}</h4>
                        )}
                      </Grid>
                    </Grid>
                    <hr />
                    <Grid container spacing={0} sx={{ marginTop: 1 }}>
                      <Grid item xs={6} >
                        <Button
                          variant='contained' color='success'
                          onClick={() => handleComplete(user.current_route)}
                        >
                          Complete
                        </Button>
                      </Grid>
                      <Grid item xs={6} >
                        <Button
                          onClick={handleClickOpen}
                          variant='contained' color='error'>
                          Abort
                        </Button>

                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    Confirm Abort Route?
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      By aborting route, you will not make the profits and your aborted routes stat will increment
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}
                      variant='contained'
                    >Back</Button>
                    <Button
                      onClick={() => handleAbort()}
                      variant='contained' color='error'
                    >
                      Abort
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid>
            </Grid>
          </Container>
        </Box>
      }
    </>

  );

}

export default DriverRouting