import React, { useState, useEffect, useContext } from 'react'
import { Box, Card, CardContent, Typography, Button, Stack, Grid, Divider, CardActions } from '@mui/material'
import InfoBox from '../../components/InfoBox'
import CardTitle from '../../components/CardTitle'
import TopUpDialog from '../../components/TopUpDialog'
import EditIcon from '@mui/icons-material/Edit';
import BadgeIcon from '@mui/icons-material/Badge';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { DirectionsBike } from '@mui/icons-material'
import { ProfileContext } from './ProfileRoutes'
import http from '../../http'
import { useNavigate, Link } from 'react-router-dom'
import useUser from '../../context/useUser'

function ViewProfile() {
    const { profile, setProfile } = useContext(ProfileContext)
    const { user, refreshUser } = useUser()
    const [topupOpen, setTopupOpen] = useState(false)
    const [FAEnabled, setFAEnabled] = useState(false)
    const navigate = useNavigate()

    const check2FA = () => {
        http.get("/user/2fa/backup").then((res) => {
            if (res.status === 200) {
                setFAEnabled(true)
            }
        }).catch((err) => {
            if (err.response.status != 404) {
                enqueueSnackbar("Failed to check 2FA status", { variant: "error" });
            }
        })
    }

    const handleTopupOpen = () => {
        setTopupOpen(true)
    }

    const handleTopupClose = () => {
        setTopupOpen(false)
        http.get("/profile").then(res => {
            setProfile(res.data)
        })
    }

    const handleEditProfile = () => {
        navigate("/profile/edit")
    }

    const handleOnPaymentSuccess = () => {
        http.get("/profile").then(res => {
            setProfile(res.data)
        })
    }

    useEffect(() => {
        document.title = "EnviroGo - Account Overview"
        check2FA()
        refreshUser()
    }, [])

    return (
        <>
            <Stack direction="column" spacing={2}>
                <Card>
                    <CardContent>
                        <CardTitle icon={<BadgeIcon />} title="Profile Information" />
                        <Grid container spacing={2} marginTop={"1rem"}>
                            <Grid item xs={12} sm={6} lg={4}>
                                <InfoBox title="Name" value={user?.name} />
                            </Grid>
                            <Grid item xs={12} sm={6} lg={4}>
                                <InfoBox title="Phone Number" value={user?.phone_number} />
                            </Grid>
                            <Grid item xs={12} sm={6} lg={4}>
                                <InfoBox title="E-mail Address" value={user?.email} />
                            </Grid>
                            <Grid item xs={12}>
                                <InfoBox title="Delivery Address" value={user?.delivery_address} />
                            </Grid>
                            {/* <Grid item xs={12} sm={6} lg={4}>
                                <InfoBox title="Driver Application" value="Not Approved" boolean={false} />
                            </Grid>
                            <Grid item xs={12} sm={6} lg={4}>
                                <InfoBox title="Driver Status" value="Not Active" boolean={false} />
                            </Grid> */}
                            <Grid item xs={12} sm={6} lg={4}>
                                <InfoBox title="2 Factor Authentication" value={FAEnabled ? "Enabled" : "Disabled"} boolean={FAEnabled} />
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Button variant="text" color="primary" startIcon={<EditIcon />} onClick={handleEditProfile}>Edit Profile</Button>
                    </CardActions>
                </Card>
                <Card>
                    <CardContent>
                        <CardTitle icon={<DirectionsBike />} title="Bicycle Pass Status" />
                        <Grid container marginTop={"1rem"}>
                            <Grid item xs={12} sm marginBottom={["1rem", 0]}>
                                <Box display="flex" alignItems={"center"}>
                                    <InfoBox flexGrow={1} title="Pass Status" value={(new Date(user?.bike_pass_expiry) > new Date()) ? "Active" : "Not Active"} boolean={new Date(user?.bike_pass_expiry) > new Date()} />
                                    <Button variant="text" color="primary" LinkComponent={Link} to="/products">Buy</Button>
                                </Box>
                            </Grid>
                            <Divider orientation="vertical" sx={{ marginX: "1rem" }} flexItem />
                            <Grid item xs={12} sm>
                                <Box display="flex" alignItems={"center"}>
                                    <InfoBox flexGrow={1} title="Pass valid till" value={user?.bike_pass_expiry ? new Date(user?.bike_pass_expiry).toLocaleString() : "Not Bought"} />
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <CardTitle icon={<AccountBalanceWalletIcon />} title="Account Balances" />
                        <Grid container marginTop={"1rem"}>
                            <Grid item xs={12} sm marginBottom={["1rem", 0]}>
                                <Box display="flex" alignItems={"center"}>
                                    <InfoBox flexGrow={1} title="Cash Balance" value={<Typography variant='h5' fontWeight={700}>${user?.cash}</Typography>} />
                                    <Button variant="text" color="primary" onClick={handleTopupOpen}>Top-up</Button>
                                </Box>
                            </Grid>
                            <Divider orientation="vertical" sx={{ marginX: "1rem" }} flexItem />
                            <Grid item xs={12} sm>
                                <Box display="flex" alignItems={"center"}>
                                    <InfoBox flexGrow={1} title="GreenMiles Points" value={<Typography variant='h5' fontWeight={700}>{user?.points} GM</Typography>} />
                                    <Button variant="text" color="primary" LinkComponent={Link} to="/products">Redeem</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Stack>
            <TopUpDialog open={topupOpen} onClose={handleTopupClose} />
        </>
    )
}

export default ViewProfile