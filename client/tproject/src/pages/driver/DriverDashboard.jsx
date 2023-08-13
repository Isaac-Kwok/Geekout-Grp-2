import { React, useEffect, useState } from 'react'
import { Box, Card, CardContent, Stack, Avatar, Typography, Grid, Container, Button, CardActions, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import CardTitle from '../../components/CardTitle';
import useUser from '../../context/useUser';
import WalletIcon from '@mui/icons-material/Wallet';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import SocialDistanceIcon from '@mui/icons-material/SocialDistance';
import ReviewsIcon from '@mui/icons-material/Reviews';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import http from '../../http'
import { Link } from 'react-router-dom';
import { BarChart, PieChart } from '@mui/x-charts';
import { axisClasses } from '@mui/x-charts';


function DriverDashboard() {
  const { user, refreshUser } = useUser();
  const [allRoutes, setallRoutes] = useState([])
  const columns = [
    { field: 'id', headerName: 'Ride Id', width: 70 },
    { field: 'distance', headerName: 'Distance', width: 120 },
    { field: 'driver_profit', headerName: 'Profit', width: 120 },
    { field: 'pickUp', headerName: 'Pick Up', width: 200 },


  ];
  const [open, setOpen] = useState(false);
  const [distanceRanges, setDistanceRanges] = useState([])
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const getAllRoutes = () => {
    http.get('/driver/getRoutes')
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          setallRoutes(res.data);
          calculateDistanceRanges(res.data);
        } else {
          console.log("Failed to retrieve routes:", res.status);
        }
      })
      .catch((err) => {
        alert("ERROR:" + JSON.stringify(err.responseJSON.error));
      })

  }
  function calculateDistanceRanges(inputList) {
    const distanceRanges = [
      { id: 0, value: 0, label: 'Distance < 5KM', color: "#FFBB28" },
      { id: 1, value: 0, label: '5KM < Distance < 10KM', color: "#00C49F" },
      { id: 2, value: 0, label: 'Distance > 10KM', color: "#FF8042" },
    ];

    inputList.forEach((ride) => {
      const distanceValue = ride.distance_value;

      if (distanceValue < 5000) {
        distanceRanges[0].value += 20;
      } else if (distanceValue >= 5000 && distanceValue < 10000) {
        distanceRanges[1].value += 20;
      } else {
        distanceRanges[2].value += 20;
      }
    });
    setDistanceRanges(distanceRanges)
    return distanceRanges;
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
                <Button to='/profile/wallet' LinkComponent={Link} size="large">Withdraw</Button>
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
                      Accepted Drives
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
                  This shows your total Accepted routes and their details
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="large" to='/driver/pastRoutes' LinkComponent={Link}>View all</Button>
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
                <Button size="large" onClick={handleClickOpen}>
                  Learn more
                </Button>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Distance ranges for all your routes"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      We collect data like distance travelled per route for all your routes to present you usefull information and data that can provide you with valuable insights!
                    </DialogContentText>
                    <PieChart
                      series={[
                        {
                          data: distanceRanges,
                        },
                      ]}
                      height={250}
                      sx={{
                        "--ChartsLegend-rootOffsetX": "-6rem",

                      }}

                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
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
                      ? / 5 Stars
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
                <Button  to='/driver/Reviews' LinkComponent={Link} size="large">View all</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ marginTop: "1rem", marginBottom: "2rem" }}>
          <Grid item xl={7} lg={7} md={7} sm={12} xs={12}>
            <div style={{ height: 400, width: '100%', }}>
              <DataGrid
                sx={{ backgroundColor: "white" }}
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
          <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
            {user?.account_type === 2 &&
              <Card>
                <CardContent>
                  <CardTitle icon={<TimeToLeaveIcon />} title="Time to drive" />
                  <p>Greatness awaits, Get excited and start up your vehicle and start Accepting route requests and start driving to earn some money!</p>
                  <Button to="/driver/routes" LinkComponent={Link} variant='contained' >Start Driving</Button>
                </CardContent>
              </Card>}
            {user?.account_type === 1 &&
              <Card>
                <CardContent>
                  <CardTitle icon={<TimeToLeaveIcon />} title="Your Driver account has been deactivated" />
                  <p>Oh No!, Your driver account has been deactivated, you can still access your driver information, but cannot accept routes and drive others, please visit our support and launch a support ticket to reactivate your account.</p>
                  <Button to="/support" LinkComponent={Link} variant='contained' >Support</Button>

                </CardContent>
              </Card>}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default DriverDashboard