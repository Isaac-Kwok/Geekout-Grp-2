import { React, useEffect, useState } from 'react'
import { Link, Box, Card, CardContent, Stack, Avatar, Typography, Grid, Container, Button, CardActions } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import useUser from '../../context/useUser';
import WalletIcon from '@mui/icons-material/Wallet';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import SocialDistanceIcon from '@mui/icons-material/SocialDistance';
import ReviewsIcon from '@mui/icons-material/Reviews';
import http from '../../http'
import { Margin } from '@mui/icons-material';

function DriverDashboard() {
  const { user, refreshUser } = useUser();
  const [allRoutes, setallRoutes] = useState([])
  const columns = [
    { field: 'id', headerName: 'Ride Id', width: 70 },
    { field: 'distance', headerName: 'Distance', width: 120 },
    { field: 'driver_profit', headerName: 'Profit', width: 120 },
    { field: 'pickUp', headerName: 'Pick Up', width: 200 },


  ];
  const getAllRoutes = () => {
    http.get('/driver/getRoutes')
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          setallRoutes(res.data);
        } else {
          console.log("Failed to retrieve routes:", res.status);
        }
      })
      .catch((err) => {
        alert("ERROR:" + JSON.stringify(err.responseJSON.error));
      })

  }

  useEffect(() => {
    refreshUser()
    getAllRoutes()
    console.log(user)

  }, [])

  return (
    <Box sx={{
      border: 'solid, black',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Container maxWidth="xl" sx={{ marginTop: '2rem' }}>
        <Grid container spacing={2} sx={{ marginBottom: "1.5em" }}>
          <Grid item xs={12} xl={3} md={6} sm={6}>
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
                      Profits Earned
                    </Typography>
                    <Typography variant="h4">
                      ${user?.total_earned.toFixed(2)}
                    </Typography>
                  </Stack>
                  <Avatar
                    sx={{
                      backgroundColor: 'success.main',
                      height: 56,
                      width: 56
                    }}
                  >
                    <WalletIcon />
                  </Avatar>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ marginTop: '0.5rem' }}>
                  This shows your profits earned from driving others
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="large">Top-Up</Button>
                <Button size="large">Withdraw</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} xl={3} md={6} sm={6}>
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
                      Total Drives
                    </Typography>
                    <Typography variant="h4">
                      {user?.accepted_routes}
                    </Typography>
                  </Stack>
                  <Avatar
                    sx={{
                      backgroundColor: 'secondary.main',
                      height: 56,
                      width: 56
                    }}
                  >

                    <DirectionsCarFilledIcon />

                  </Avatar>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ marginTop: '0.5rem' }}>
                  This shows your total driven routes and their details
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="large" href='/driver/pastRoutes'>View all</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} xl={3} md={6} sm={6}>
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
                      Driven Distance
                    </Typography>
                    <Typography variant="h4">
                      {(user?.driven_distance / 1000).toFixed(3)}km
                    </Typography>
                  </Stack>
                  <Avatar
                    sx={{
                      backgroundColor: '#6AC4FB',
                      height: 56,
                      width: 56
                    }}
                  >
                    <SocialDistanceIcon />

                  </Avatar>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ marginTop: '0.5rem' }}>
                  This shows your total driven distance when on duty, keep it up!
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="large">Learn more</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} xl={3} md={6} sm={6}>
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
                      Reviews
                    </Typography>
                    <Typography variant="h4">
                      4.3 Stars
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
                  This shows your average review ratings from your customers
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="large">View all</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{marginTop:"1rem", marginBottom:"2rem"}}>
          <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
            <div style={{ height: 400, width: '100%', }}>
              <DataGrid
              sx={{backgroundColor:"white"}}
                rows={allRoutes}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
             

              />
            </div>
          </Grid>
          <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
            <Card>
              <CardContent>
                <h3>Time to drive</h3>
                <p>Start Accepting route requests and start driving to earn some money!</p>
                <Button href="/driver/routes" variant='contained' >Start Driving</Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default DriverDashboard