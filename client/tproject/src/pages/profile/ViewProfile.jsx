import React, { useState, useEffect, useContext } from 'react'
import { Container, Box, Card, CardContent, CardActions, Typography, Button, Stack, Grid, Divider } from '@mui/material'
import InfoBox from '../../components/InfoBox'
import CardTitle from '../../components/CardTitle'
import TopUpDialog from '../../components/TopUpDialog'

import BadgeIcon from '@mui/icons-material/Badge';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { ProfileContext } from './ProfileRoutes'

function ViewProfile() {
    const { profile, setProfile } = useContext(ProfileContext)
    const [topupOpen, setTopupOpen] = useState(false)

    const handleTopupOpen = () => {
        setTopupOpen(true)
    }

    const handleTopupClose = () => {
        setTopupOpen(false)
    }

    useEffect(() => {
        document.title = "EnviroGo - Account Overview"
    }, [])

    return (
        <>
            <Stack direction="column" spacing={2}>
                <Card>
                    <CardContent>
                        <CardTitle icon={<BadgeIcon />} title="Profile Information" />
                        <Grid container spacing={2} marginTop={"1rem"}>
                            <Grid item xs={6} md={4}>
                                <InfoBox title="Name" value={profile.name} />
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <InfoBox title="Phone Number" value={profile.phone_number} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InfoBox title="E-mail Address" value={profile.email} />
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <InfoBox title="Driver Application" value="Not Approved" boolean={false} />
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <InfoBox title="Driver Status" value="Not Active" boolean={false} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InfoBox title="2 Factor Authentication" value={profile.is_2fa_enabled ? "Active" : "Not Active"} boolean={profile.is_2fa_enabled} />
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
                                    <InfoBox flexGrow={1} title="Cash Balance" value={<Typography variant='h5' fontWeight={700}>${profile.cash}</Typography>} />
                                    <Button variant="text" color="primary" onClick={handleTopupOpen}>Top-up</Button>
                                </Box>
                            </Grid>
                            <Divider orientation="vertical" sx={{marginX: "1rem"}} flexItem />
                            <Grid item xs={12} sm>
                                <Box display="flex" alignItems={"center"}>
                                    <InfoBox flexGrow={1} title="GreenMiles Points" value={<Typography variant='h5' fontWeight={700}>{profile.points} GM</Typography>} />
                                    <Button variant="text" color="primary">Redeem</Button>
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