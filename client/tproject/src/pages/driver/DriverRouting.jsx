import React from 'react'
import { GoogleMap, MarkerF, useLoadScript, useJsApiLoader, DirectionsRenderer, Autocomplete } from "@react-google-maps/api";
import { Button, Container, Stack, Divider, Grid, Card, CardContent, Box, TextField } from '@mui/material';
import { useMemo, useState, useRef, useEffect } from "react";
import googleMapsReverseGeocoder from '../../googleMapsReverseGeocoder'

function DriverRouting() {
  const [latitude, setlatitude] = useState(1.3521)
  const [longtitude, setlongtitude] = useState(103.8198)
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_DRIVER_GOOGLE_API_KEY,
    libraries: ['places'],
  })
  const center = { lat: latitude, lng: longtitude };
  const [map, setMap] = useState(/** @type google.maps.Map */(null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [address, setaddress] = useState('')

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef('')
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef('')
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  function showPosition(position) {
    setlatitude(position.coords.latitude)
    setlongtitude(position.coords.longitude)
    googleMapsReverseGeocoder.get("json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&key=" + import.meta.env.VITE_DRIVER_GOOGLE_API_KEY)
      .then((res) => {
        if (res.status === 200) {
          setaddress(res.data.results[1].formatted_address)
          originRef.current.value = address
        } else {
          console.log("Address retrieval failed", res.status)
        }
      })
  }

  if (!isLoaded) {
    return (
      <h2>Loading...</h2>
    )
  }
  else {
    const calculateRoute = async () => {
      if (!originRef.current.value || !destinationRef.current.value) {
        return
      }
      else {
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService()
        const results = await directionsService.route({
          origin: originRef.current.value,
          destination: destinationRef.current.value,
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        })
        setDirectionsResponse(results)
        setDistance(results.routes[0].legs[0].distance.text)
        setDuration(results.routes[0].legs[0].duration.text)
      }
    }
    function clearRoute() {
      setDirectionsResponse(null)
      setDistance('')
      setDuration('')
      originRef.current.value = ''
      destinationRef.current.value = ''
      window.reload
    }

    return (
      <Box sx={{
        border: 'solid, black',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Container maxWidth="xl" sx={{ marginTop: '2rem' }}>
          <Grid container spacing={2}>
            <Grid item xs={9} lg={9} md={7} sm={12}>

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
            <Grid item xs={3} lg={3} md={5} sm={12}>
              <Card sx={{ marginBottom: '1rem' }}>
                <CardContent>
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
                      {distance && (
                        <h5>Distance: {directionsResponse.routes[0].legs[0].distance.text}</h5>
                      )}
                    </Grid>
                    <Grid item xs={6} >
                      {duration && (
                        <h5>Duration: {directionsResponse.routes[0].legs[0].duration.text}</h5>
                      )}
                    </Grid>
                  </Grid>

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
              <Card>
                <CardContent>
                  Route 1
                  by marry
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

}

export default DriverRouting