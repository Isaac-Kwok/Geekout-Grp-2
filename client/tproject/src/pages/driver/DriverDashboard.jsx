import React from 'react'
import { Link, Box, Card, CardContent, Stack, Avatar, Typography, Grid, Container, Button, CardActions } from '@mui/material'
import WalletIcon from '@mui/icons-material/Wallet';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import SocialDistanceIcon from '@mui/icons-material/SocialDistance';
import ReviewsIcon from '@mui/icons-material/Reviews';

function DriverDashboard() {
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
                      Wallet Balance
                    </Typography>
                    <Typography variant="h4">
                      $432.32
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
                  This shows your wallet ballance from the profits made from driving others
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
                      12
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
                      128KM
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
        <Link href="/driver/routes">Driver routes</Link>
      </Container>
    </Box>
  )
}

export default DriverDashboard