import { useEffect, useContext, useState } from 'react'
import { Container, Box, Card, CardContent, CardActions, Typography, Button, Stack, Grid, Divider, TextField } from '@mui/material'
import InfoBox from '../../components/InfoBox'
import CardTitle from '../../components/CardTitle'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import PaymentsIcon from '@mui/icons-material/Payments';
import { ProfileContext } from './ProfileRoutes'
import TopUpDialog from '../../components/TopUpDialog'


function ViewWallet() {

    const { profile } = useContext(ProfileContext)
    const [topupOpen, setTopupOpen] = useState(false)

    const handleTopupOpen = () => {
        setTopupOpen(true)
    }

    const handleTopupClose = () => {
        setTopupOpen(false)
    }

    useEffect(() => {
        document.title = "EnviroGo - Wallet"
    }, [])

    return (
        <>
            <Stack direction="column" spacing={2}>
                <Card>
                    <CardContent>
                        <CardTitle icon={<PaymentsIcon />} title="Cash Wallet" />
                        <Grid container marginTop={"1rem"} alignItems={"center"}>
                            <Grid item xs={12} sm marginBottom={["1rem", 0]}>
                                <Box display="flex" alignItems={"center"}>
                                    <InfoBox flexGrow={1} title="Cash Balance" value={<Typography variant='h5' fontWeight={700}>${profile.cash}</Typography>} />
                                    <Button variant="text" color="primary"onClick={handleTopupOpen}>Top-up</Button>
                                </Box>
                            </Grid>
                            <Divider orientation="vertical" sx={{ marginX: "1rem" }} flexItem />
                            <Grid item xs={12} sm>
                                <Box display="flex" alignItems={"center"}>
                                    <Box flexGrow={1}>
                                        <Typography variant="body" fontWeight={700}>Withdraw Balance</Typography>
                                        <br />
                                        <Typography variant="body" marginTop={"0.25rem"}>Withdraw your balance here.</Typography>
                                    </Box>
                                    <Button variant="text" color="primary">Withdraw</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <CardTitle icon={<EnergySavingsLeafIcon />} title="GreenMiles Points" />
                        <Grid container marginTop={"1rem"} alignItems={"center"}>
                            <Grid item xs={12} sm marginBottom={["1rem", 0]}>
                                <Box display="flex" alignItems={"center"}>
                                    <InfoBox flexGrow={1} title="GreenMiles Points" value={<Typography variant='h5' fontWeight={700}>{profile.points} GM</Typography>} />
                                </Box>
                            </Grid>
                            <Divider orientation="vertical" sx={{ marginX: "1rem" }} flexItem />
                            <Grid item xs={12} sm>
                                <Box component="form" display="flex" alignItems={"center"}>
                                    <Box marginRight={"1rem"}>
                                        <Typography variant="body" fontWeight={700}>About GreenMiles</Typography>
                                        <br />
                                        <Typography variant="body" marginTop={"0.25rem"}>GreenMiles is a reward currency given when using our services. Points can be redeem on the shop.</Typography>
                                    </Box>
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

export default ViewWallet