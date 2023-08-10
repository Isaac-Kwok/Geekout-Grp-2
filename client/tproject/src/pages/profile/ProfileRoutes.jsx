import { useContext, useEffect, createContext, useState } from 'react'
import { Route, Routes, useNavigate, Link, useLocation } from 'react-router-dom'
import { Container, Box, Card, Typography, Grid, List, ListItem, ListItemText, ListItemButton, ListItemIcon, Tooltip, IconButton, Dialog, DialogTitle, DialogActions, DialogContentText, Stack, DialogContent, Button } from '@mui/material'
import { LoadingButton } from '@mui/lab';
import ProfilePicture from '../../components/ProfilePicture'
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import KeyIcon from '@mui/icons-material/Key';
import HistoryIcon from '@mui/icons-material/History';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PublicIcon from '@mui/icons-material/Public';
import { useSnackbar } from 'notistack'
import { UserContext } from '../..'
import { validateUser } from '../../functions/user'
import NotFound from '../errors/NotFound'
import ViewProfile from './ViewProfile'
import ViewWallet from './ViewWallet'
import ViewLogins from './ViewLogins';
import ViewTransactionHistory from './ViewTransactionHistory';
import ViewTransactionHistoryDetails from './ViewTransactionHistoryDetails';
import ViewDriverInformation from './ViewDriverInformation';
import EditProfile from './EditProfile';
import ViewOrderHistory from './ViewOrderHistory';
import ViewSingleOrder from './ViewSingleOrder';
import ViewRefunds from './ViewRefund';
import http from '../../http'

export const ProfileContext = createContext(null)
function ProfileRoutes() {
    const { user, setUser } = useContext(UserContext);
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
    const [changePictureDialog, setChangePictureDialog] = useState(false);
    const [loadingPicture, setLoadingPicture] = useState(false);
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()

    const handleChangePictureDialogClose = () => {
        setChangePictureDialog(false);
    }

    const handleChangePictureDialogOpen = () => {
        setChangePictureDialog(true);
    }

    const handlePictureChange = (e) => {
        setLoadingPicture(true);
        console.log(e);
        const formData = new FormData();
        formData.append("profile_picture", e.target.files[0]);
        http.post("/user/upload", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((res) => {
            if (res.status === 200) {
                enqueueSnackbar("Profile picture updated successfully!", { variant: "success" });
                setUser(res.data);
                setLoadingPicture(false);
                handleChangePictureDialogClose();
            } else {
                enqueueSnackbar("Profile picture update failed!", { variant: "error" });
                setLoadingPicture(false);
                handleChangePictureDialogClose();
            }
        }).catch((err) => {
            enqueueSnackbar("Profile picture update failed! " + err.response.data.message, { variant: "error" });
            setLoadingPicture(false);
            handleChangePictureDialogClose();
        })
    }

    const handleGravatarChange = () => {
        setLoadingPicture(true);
        const data = {
            profile_picture_type: "gravatar"
        }
        http.put("/user", data).then((res) => {
            if (res.status === 200) {
                enqueueSnackbar("Profile picture updated successfully!", { variant: "success" });
                setUser(res.data);
                setLoadingPicture(false);
                handleChangePictureDialogClose();
            } else {
                enqueueSnackbar("Profile picture update failed!", { variant: "error" });
                setLoadingPicture(false);
                handleChangePictureDialogClose();
            }
        }).catch((err) => {
            enqueueSnackbar("Profile picture update failed! " + err.response.data.message, { variant: "error" });
            setLoadingPicture(false);
            handleChangePictureDialogClose();
        })
    }

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
                    <Tooltip title="Change Profile Picture" arrow>
                        <IconButton onClick={handleChangePictureDialogOpen}>
                            {user &&
                                <ProfilePicture user={user} sx={{ width: ["72px", "96px", "128px"], height: ["72px", "96px", "128px"] }} />
                            }
                        </IconButton>
                    </Tooltip>
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
                                    <ListItemButton component={Link} to="/profile" selected={(location.pathname == "/profile" || location.pathname.includes("/profile/edit"))}>
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
                                <ListItem key={"Orders History"} disablePadding>
                                    <ListItemButton component={Link} to="/profile/orders" selected={(location.pathname.includes("/profile/orders"))}>
                                        <ListItemIcon><ReceiptLongIcon /></ListItemIcon>
                                        <ListItemText primary={"Orders History"} />
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
                                <Route path="/edit" element={<EditProfile />} />
                                <Route path="/wallet" element={<ViewWallet />} />
                                <Route path="/logins" element={<ViewLogins />} />
                                <Route path="/history" element={<ViewTransactionHistory />} />
                                <Route path="/driverInformation" element={<ViewDriverInformation />} />
                                <Route path="/history/:id" element={<ViewTransactionHistoryDetails />} />
                                <Route path="/orders" element={<ViewOrderHistory />} />
                                <Route path="/orders/:id" element={<ViewSingleOrder />} />
                                <Route path="/refunds/:id" element={<ViewRefunds />} />
                            </Routes>
                        </ProfileContext.Provider>

                    </Grid>
                </Grid>
            </Container>
            <Dialog open={changePictureDialog} onClose={handleChangePictureDialogClose}>
                <DialogTitle>Change Profile Picture</DialogTitle>
                <Box component="form">
                    <DialogContent sx={{ paddingTop: 0 }}>
                        <DialogContentText>
                            You are currently using a {user ? user.profile_picture_type === "gravatar" ? "Gravatar" : "local" : "unknown"} profile picture.
                            <br /><br />
                            You can select a new profile picture from your computer or from Gravatar. To set a new profile picture from your computer, click on the "Choose File" button below. To set a new profile picture from Gravatar, click on the "Use Gravatar" button below.
                            <br /><br />
                            For information on how to set a profile picture on Gravatar, please visit <Link href="https://en.gravatar.com/support/">https://en.gravatar.com/support/</Link>.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Stack direction={["column", "row"]} spacing={1}>
                            <Button style={{justifyContent: "flex-end"}} onClick={handleChangePictureDialogClose} startIcon={<CloseIcon />}>Cancel</Button>
                            <LoadingButton style={{justifyContent: "flex-end"}} loadingPosition="start" loading={loadingPicture} variant="text" color="primary" startIcon={<PublicIcon />} onClick={handleGravatarChange}>Use Gravatar</LoadingButton>
                            <LoadingButton style={{justifyContent: "flex-end"}} loadingPosition="start" loading={loadingPicture} variant="text" color="primary" startIcon={<FileUploadIcon />} component="label">Upload Image<input type='file' onChange={handlePictureChange} hidden /></LoadingButton>
                        </Stack>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}

export default ProfileRoutes