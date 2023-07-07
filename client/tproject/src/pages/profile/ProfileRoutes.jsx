import { useContext, useEffect, createContext, useState } from 'react'
import { Route, Routes, useNavigate, Link, useLocation } from 'react-router-dom'
import { Container, Box, Card, CardContent, Typography, Grid, List, ListItem, ListItemText, ListItemButton, ListItemIcon } from '@mui/material'
import ProfilePicture from '../../components/ProfilePicture'
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import KeyIcon from '@mui/icons-material/Key';
import HistoryIcon from '@mui/icons-material/History';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import { useSnackbar } from 'notistack'
import Test from '../Test'
import { UserContext } from '../..'
import { validateUser } from '../../functions/user'
import NotFound from '../errors/NotFound'
import ViewProfile from './ViewProfile'
import ViewWallet from './ViewWallet'
import ViewLogins from './ViewLogins';
import ViewTransactionHistory from './ViewTransactionHistory';
import ViewTransactionHistoryDetails from './ViewTransactionHistoryDetails';
import http from '../../http'
import ViewDriverInformation from './ViewDriverInformation';

export const ProfileContext = createContext(null)
function ProfileRoutes() {
    const { user } = useContext(UserContext);
    const location = useLocation()
    const [profile, setProfile] = useState({
        id: 1,
        name: "",
        email: "",
        phone_number: "",
        profile_picture: "",
        profile_picture_type: "",
        is_active: false,
        is_email_verified: false,
        is_phone_verified: false,
        is_2fa_enabled: false,
        cash: 0,
        points: 0,
    },)
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        if (!validateUser()) {
            enqueueSnackbar("You must be logged in to view this page", { variant: "error" })
            return navigate("/login")
        }

        http.get("/user").then(res => {
            setProfile(res.data)
        })
    }, [])

    return (
        <>
            <Container maxWidth="xl" sx={{ marginBottom: "1rem" }}>
                <Box display={"flex"} alignItems={"center"} flexDirection={["column", "column", "row"]} justifyContent={["center", "center", "initial"]} marginY={"2rem"}>
                    {user && <ProfilePicture user={user} sx={{ width: ["72px", "96px", "128px"], height: ["72px", "96px", "128px"] }} />}
                    <Box sx={{ marginLeft: { md: "2rem" }, marginTop: { xs: "1rem", md: 0 }, textAlign: ["center", "center", "initial"] }}>
                        <Typography fontWeight={700} variant="h4">{user && user.name}</Typography>
                        <Typography variant="h6">{user && user.email}</Typography>
                    </Box>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <List>
                                <ListItem key={"Account Overview"} disablePadding>
                                    <ListItemButton component={Link} to="/profile" selected={(location.pathname == "/profile")}>
                                        <ListItemIcon><PersonIcon /></ListItemIcon>
                                        <ListItemText primary={"Account Overview"} />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem key={"Driver Information"} disablePadding>
                                    <ListItemButton component={Link} to="/profile/driverInformation" selected={(location.pathname == "/profile/driverInformation")}>
                                        <ListItemIcon><DriveEtaIcon /></ListItemIcon>
                                        <ListItemText primary={"Driver Information"} />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem key={"Wallet"} disablePadding>
                                    <ListItemButton component={Link} to="/profile/wallet" selected={(location.pathname == "/profile/wallet")}>
                                        <ListItemIcon><AccountBalanceWalletIcon /></ListItemIcon>
                                        <ListItemText primary={"Wallet"} />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem key={"Logins & 2FA"} disablePadding>
                                    <ListItemButton component={Link} to="/profile/logins" selected={(location.pathname == "/profile/logins")}>
                                        <ListItemIcon><KeyIcon /></ListItemIcon>
                                        <ListItemText primary={"Logins & 2FA"} />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem key={"Transaction History"} disablePadding>
                                    <ListItemButton component={Link} to="/profile/history" selected={(location.pathname.includes("/profile/history"))}>
                                        <ListItemIcon><HistoryIcon /></ListItemIcon>
                                        <ListItemText primary={"Transaction History"} />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <ProfileContext.Provider value={{ profile: profile, setProfile: setProfile }}>
                            <Routes>
                                <Route path="*" element={<NotFound />} />
                                <Route path="/" element={<ViewProfile />} />
                                <Route path="/wallet" element={<ViewWallet />} />
                                <Route path="/logins" element={<ViewLogins />} />
                                <Route path="/history" element={<ViewTransactionHistory />} />
                                <Route path="/driverInformation" element={<ViewDriverInformation />} />
                                <Route path="/history/:id" element={<ViewTransactionHistoryDetails />} />
                            </Routes>
                        </ProfileContext.Provider>

                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export default ProfileRoutes