import React from 'react'
import { GoogleMap, MarkerF, useLoadScript, useJsApiLoader, DirectionsRenderer, Autocomplete, } from "@react-google-maps/api";
import { Button, Container, Stack, Divider, Grid, Card, CardContent, Box, TextField, Typography } from '@mui/material';
import { useMemo, useState, useRef, useEffect } from "react";
import googleMapsReverseGeocoder from '../../googleMapsReverseGeocoder'
import http from '../../http'
import { CopyAllSharp } from '@mui/icons-material';
import { useSnackbar } from 'notistack';


function DriverRouting() {
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
  const [duration, setDuration] = useState('')
  const [visibleRoutes, setVisibleRoutes] = useState();
  const { enqueueSnackbar } = useSnackbar();

  const originRef = useRef({})
  const destinationRef = useRef({})

  const test = [
    {
      id: 1,
      pickUp: "Yio Chu Kang MRT station",
      destination: "Ang Mo Kio Hub",
      rider_name: "Brian Yuk"
    },
    {
      id: 2,
      pickUp: "Marina Bay Sands",
      destination: "Gardens by the Bay",
      rider_name: "Brian Yuk"
    },
    {
      id: 3,
      pickUp: "Yio Chu Kang MRT station",
      destination: "Ang Mo Kio Hub",
      rider_name: "Brian Yuk"
    },
    {
      id: 11,
      pickUp: "Yio Chu Kang MRT station",
      destination: "Ang Mo Kio Hub",
      rider_name: "Brian Yuk"
    },
  ];
  function groupRidesByPickUp(rides, maxRidesPerList) {
    const groupedRides = [];

    // Iterate through each ride
    rides.forEach((ride) => {
      let addedToExistingList = false;

      // Check if the current ride can be added to an existing list
      for (let i = 0; i < groupedRides.length; i++) {
        if (groupedRides[i][0].pickUp === ride.pickUp && groupedRides[i].length < maxRidesPerList) {
          groupedRides[i].push(ride);
          addedToExistingList = true;
          break;
        }
      }

      // If the ride was not added to an existing list, create a new list for it
      if (!addedToExistingList) {
        groupedRides.push([ride]);
      }
    });

    return groupedRides;
  }
  function createSummaryList(groupedRides) {
    const summaryList = [];

    // Iterate through each group of rides with the same pickUp location
    for (const rideGroup of groupedRides) {
      const pickUpLocation = rideGroup[0].pickUp;
      const wayPoints = []; // Create a new waypoints array for each group

      // Populate the waypoints array for the current group
      for (const ride of rideGroup) {
        const wayPoint = {
          location: ride.destination,
          stopover: true,
        };
        wayPoints.push(wayPoint);
      }

      // Get the destination from the last waypoint
      const destination = wayPoints[wayPoints.length - 1].location;

      // Remove the last waypoint
      wayPoints.pop();

      // Extract the names from the rides in the group
      const names = rideGroup.map((ride) => ride.rider_name);

      // Create the summary object and add it to the summaryList
      const summaryObject = {
        pickUp: pickUpLocation,
        wayPoints: wayPoints,
        names: names,
        destination: destination, // Add the destination attribute
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
    setlatitude(position.coords.latitude)
    setlongtitude(position.coords.longitude)
    googleMapsReverseGeocoder.get("json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&key=" + import.meta.env.VITE_DRIVER_GOOGLE_API_KEY)
      .then((res) => {
        if (res.status === 200) {
          originRef.current.value = res.data.results[1].formatted_address
          console.log('address', originRef.current.value)
        } else {
          console.log("Address retrieval failed", res.status)
        }
      })
  }

  const calculateRoute = async () => {
    try {
      if (!originRef.current.value || !destinationRef.current.value) {
        return;
      } else {
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService();
        const results = await directionsService.route({
          origin: originRef.current.value,
          destination: destinationRef.current.value,
          waypoints: [],
          optimizeWaypoints: true,
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        });
        setDirectionsResponse(results);
        setDistance(results.routes[0].legs[0].distance.text);
        setDuration(results.routes[0].legs[0].duration.text);
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      // Handle the error here, e.g., display an error message or take appropriate action
      enqueueSnackbar("Please input a start destination", { variant: "error" })
    }
  };


  const configureDestination = async (waypoints, destination) => {
    try {
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destination,
        waypoints: waypoints,
        optimizeWaypoints: true,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      });
      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance.text);
      setDuration(results.routes[0].legs[0].duration.text);
      return {
        distance: results.routes[0].legs[0].distance.text,
        distanceValue: results.routes[0].legs[0].distance.value,
        duration: results.routes[0].legs[0].duration.text,
      };
    } catch (error) {
      console.error('Error configuring destination:', error);
      // Handle the error here, e.g., display an error message or take appropriate action
      enqueueSnackbar("Please input a start destination", { variant: "error" })
    }

  };


  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destinationRef.current.value = ''
  }

  const storeRoute = async (originalObj, wayPoints, destination) => {
    try {
      const configResults = await configureDestination(wayPoints, destination); // Wait for configureDestination to finish
      const { distance, distanceValue, duration } = configResults;

      console.log('distance:', distance);
      console.log('dv:', distanceValue);
      console.log('duration:', duration);
      const newObj = { ...originalObj };

      // Convert wayPoints array to a string
      newObj.wayPoints = newObj.wayPoints
        .map(wayPoint => `${wayPoint.location}`)
        .join(', ');

      // Convert names array to a string
      newObj.names = newObj.names.map(name => (name !== null ? name.toString() : 'null')).join(', ');

      // Convert destination to a string
      newObj.destination = newObj.destination.toString();
      newObj.distance = distance
      newObj.distance_value = distanceValue
      newObj.duration = duration
      newObj.driver_profit = (((distanceValue / 1000) * 2) * 0.65)
      newObj.company_profit = (((distanceValue / 1000) * 2) * 0.35)
      newObj.total_cost = ((distanceValue / 1000) * 2)

      console.log('new:', newObj);

      http.post("/driver/createRoute", newObj)
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data);
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
      enqueueSnackbar("Please input a start destination", { variant: "error" });
    }
  };


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
    console.log('after')
    const listsOfRides = groupRidesByPickUp(test, 3);
    const listsOfRoutes = createSummaryList(listsOfRides);
    setVisibleRoutes(listsOfRoutes);
    console.log(listsOfRoutes)

  }, [])

  return (
    <>
      {!isLoaded && <div>Loading...</div>}
      {isLoaded &&
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
              <Grid item xs={12} lg={3} md={5} sm={12}>
                <Card sx={{ marginBottom: '1rem' }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <h3 style={{ margin: 0 }}>Chosen Route Stats: </h3>
                        <p style={{ margin: 0 }}>Click on any of the route requests and their respective stats will be displayed</p>
                      </Grid>
                      <Grid item xs={6}>
                        {distance && (
                          <h5 style={{ margin: 0 }}>Distance: {directionsResponse.routes[0].legs[0].distance.text}</h5>
                        )}
                      </Grid>
                      <Grid item xs={6} >
                        {duration && (
                          <h5 style={{ margin: 0 }}>Duration: {directionsResponse.routes[0].legs[0].duration.text}</h5>
                        )}
                      </Grid>
                      <Grid item xs={6} >
                        {distance && (
                          <h4 style={{ margin: 0, color: 'green' }}>Profit: ${(((directionsResponse.routes[0].legs[0].distance.value / 1000) * 2) * 0.65).toFixed(2)}</h4>
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
                          <b>Waypoints:</b>
                          {routeObj.wayPoints.map((wayPoint, i) => (
                            <li key={i}>
                              {wayPoint.location}
                            </li>
                          ))}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <b>Destination:</b> {routeObj.destination}
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
    </>

  );

}

export default DriverRouting