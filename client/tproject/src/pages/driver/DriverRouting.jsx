import React from 'react'
import { GoogleMap, MarkerF, useLoadScript, useJsApiLoader, DirectionsRenderer, Autocomplete } from "@react-google-maps/api";
import { Button, Container, Stack, Divider, Grid, Card, CardContent, Box, TextField } from '@mui/material';
import PageTitle from '../../components/PageTitle';
import { useMemo, useState, useRef } from "react";

function DriverRouting() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_DRIVER_GOOGLE_API_KEY,
    libraries: ['places'],
  })
  const center = useMemo(() => ({ lat: 1.3521, lng: 103.8198 }), []);
  const [map, setMap] = useState(/** @type google.maps.Map */(null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef('')
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef('')

  const valueRef = useRef('') //creating a refernce for TextField Component

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
    }

    return (
      <Box sx={{
        border: 'solid, black',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <PageTitle title="Driver Routing" subtitle="Be a driver with us today!" />
        <Container maxWidth="xl" sx={{}}>



          <Grid container spacing={2}>
            <Grid item xs={9}>

              <GoogleMap
                center={center}
                zoom={15}
                mapContainerStyle={{ width: '100%', height: '100%', minHeight: '600px' }}
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
            <Grid item xs={3}>
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
                      margin="normal" autoComplete="off"
                      label="Current Location"
                      inputRef={originRef}
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
                        <h5>Distance: {distance}</h5>
                      )}
                    </Grid>
                    <Grid item xs={6} >
                      {duration && (
                        <h5>Duration: {duration}</h5>
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