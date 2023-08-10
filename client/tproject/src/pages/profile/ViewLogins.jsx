import { useEffect, useState, useContext } from 'react'
import { Box, Card, CardContent, CardActions, Typography, Button, Stack, Grid, Divider, DialogTitle, DialogContent, DialogActions, DialogContentText, Dialog } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useSnackbar } from 'notistack'
import { useGoogleLogin } from '@react-oauth/google'
import FacebookLogin from '@greatsumini/react-facebook-login';
import useUser from '../../context/useUser'
import QRCode from 'qrcode'
import InfoBox from '../../components/InfoBox'
import CardTitle from '../../components/CardTitle'
import LockIcon from '@mui/icons-material/Lock';
import KeyIcon from '@mui/icons-material/Key';
import SecurityIcon from '@mui/icons-material/Security';
import PinIcon from '@mui/icons-material/Pin';
import KeyOffIcon from '@mui/icons-material/KeyOff';
import CloseIcon from '@mui/icons-material/Close';
import http from '../../http'

function ViewLogins() {
    const [backup, setBackup] = useState("");
    const [FAEnabled, setFAEnabled] = useState(false);
    const [showQr, setShowQr] = useState(false);
    const [qrCode, setQrCode] = useState("");
    const [showBackup, setShowBackup] = useState(false);
    const [showDisable, setShowDisable] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState(false);
    const { user, refreshUser } = useUser();
    //const { user } = useContext(UserContext);


    const handleQrNext = () => {
        setShowQr(false);
        setShowBackup(true);
    }

    const handleShowBackup = () => {
        setShowBackup(true);
    }

    const handleShowDisable = () => {
        setShowDisable(true);
    }

    const check2FA = () => {
        http.get("/user/2fa/backup").then((res) => {
            if (res.status === 200) {
                setBackup(res.data.backup)
                setFAEnabled(true)
            }
        }).catch((err) => {
            if (err.response.status != 404) {
                enqueueSnackbar("Failed to check 2FA status", { variant: "error" });
            }
        })
    }

    const enable2FA = () => {
        setLoading(true)
        http.get("/user/2fa/enable").then((res) => {
            if (res.status === 200) {
                setBackup(res.data.backup)
                setFAEnabled(true)
                enqueueSnackbar("2FA has been enabled on your account", { variant: "success" });
                QRCode.toDataURL(res.data.otpAuthUrl).then((url) => {
                    setQrCode(url)
                    setShowQr(true)
                })
                setLoading(false)
            }
        }).catch((err) => {
            enqueueSnackbar("Failed to enable 2FA", { variant: "error" });
        })
    }

    const disable2FA = () => {
        setLoading(true)
        http.get("/user/2fa/disable").then((res) => {
            if (res.status === 200) {
                setBackup([])
                setFAEnabled(false)
                enqueueSnackbar("2FA has been disabled on your account", { variant: "success" });
                setLoading(false)
                setShowDisable(false)
            }
        }).catch((err) => {
            enqueueSnackbar("Failed to disable 2FA", { variant: "error" });
        })
    }

    const handleChangeGoogle = useGoogleLogin({
        onSuccess: (res) => {
            setSocialLoading(true)
            http.post("/user/social/google", { token: res.access_token }).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar(res.data.message, { variant: "success" });
                    refreshUser()
                    setSocialLoading(false)
                }
            }).catch((err) => {
                enqueueSnackbar("Failed to change Google account. " + err.response.data.message, { variant: "error" });
                setSocialLoading(false)
            })
        },
    })

    const handleFacebookSuccess = async (res) => {
        setSocialLoading(true)
        http.post("/user/social/facebook", { token: res.accessToken }).then((res) => {
            if (res.status === 200) {
                enqueueSnackbar(res.data.message, { variant: "success" });
                refreshUser()
                setSocialLoading(false)
            }
        }).catch((err) => {
            enqueueSnackbar("Failed to change Facebook account. " + err.response.data.message, { variant: "error" });
            setSocialLoading(false)
        })
    }

    const handleFacebookFailure = (err) => {
        console.log(err);
        if (err.status === "loginCancelled") {
            enqueueSnackbar("Login failed! Cancelled by user.", { variant: "error" });
            setLoading(false);
        } else {
            enqueueSnackbar("Login failed! " + err.status, { variant: "error" });
            setLoading(false);
        }
    }

    useEffect(() => {
        document.title = "EnviroGo - Social Logins & 2FA"
        check2FA()
    }, [])

    return (
        <>
            <Stack direction="column" spacing={2}>
                <Card>
                    <CardContent>
                        <CardTitle icon={<SecurityIcon />} title="2-Factor Authentication" />
                        <Box marginY={"1rem"}>
                            <Typography variant="body">
                                2-Factor Authentication (2FA) is an extra layer of security used to make sure that your account is only accessed by you. After you have enabled 2FA, you will be required to enter a unique code generated by an authenticator app on your phone or tablet. This code will be required in addition to your password to log in to your account.
                            </Typography>
                            <br /><br />
                            <InfoBox flexGrow={1} title="2-Factor Authentication" value={FAEnabled ? "Enabled" : "Disabled"} boolean={FAEnabled} />
                        </Box>
                    </CardContent>
                    <CardActions>
                        {!FAEnabled &&
                            <LoadingButton loading={loading} variant="text" color="primary" loadingPosition='start' startIcon={<LockIcon />} onClick={enable2FA}>Enable 2FA</LoadingButton>
                        }
                        {FAEnabled &&
                            <>
                                <Button variant="text" color="primary" startIcon={<PinIcon />} onClick={handleShowBackup}>Check Backup Codes</Button>
                                <LoadingButton loading={loading} variant="text" color="primary" loadingPosition='start' startIcon={<KeyOffIcon />} onClick={handleShowDisable}>Disable 2FA</LoadingButton>
                            </>
                        }

                    </CardActions>
                </Card>
                <Card>
                    <CardContent>
                        <CardTitle icon={<KeyIcon />} title="Link Social Logins" />
                        <Grid container marginTop={"1rem"} alignItems={"center"}>
                            <Grid item xs={12} sm marginBottom={["1rem", 0]}>
                                <Box component="form" display="flex" alignItems={"center"}>
                                    <InfoBox flexGrow={1} title="Google Account" value={user?.is_google_auth_enabled ? user?.is_google_auth_enabled : "Not Linked"} boolean={user?.is_google_auth_enabled || false} />
                                    <Button disabled={socialLoading} variant="text" color="primary" onClick={handleChangeGoogle}>{user?.is_google_auth_enabled ? "Un-link" : "Link"}</Button>
                                </Box>
                            </Grid>
                            <Divider orientation="vertical" sx={{ marginX: "1rem" }} flexItem />
                            <Grid item xs={12} sm>
                                <Box component="form" display="flex" alignItems={"center"}>
                                    <InfoBox flexGrow={1} title="Facebook Account" value={user?.is_fb_auth_enabled ? "Linked" : "Not Linked"} boolean={user?.is_fb_auth_enabled || false} />
                                    <FacebookLogin
                                        appId={import.meta.env.VITE_FACEBOOK_APP_ID}
                                        onSuccess={handleFacebookSuccess}
                                        onFail={handleFacebookFailure}
                                        render={({ onClick, logout }) => (
                                            <Button disabled={socialLoading} variant="text" color="primary" onClick={onClick}>{user?.is_fb_auth_enabled ? "Un-link" : "Link"}</Button>
                                        )}
                                    />
                                    
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Stack>
            <Dialog open={showQr} onClose={handleQrNext}>
                <DialogTitle>Scan QR Code</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Scan the QR code below with your authenticator app to link it to your account.
                    </DialogContentText>
                    <Box display="flex" justifyContent="center">
                        <img src={qrCode} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleQrNext} startIcon={<PinIcon />}>Show Backup Codes</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showBackup} onClose={() => setShowBackup(false)}>
                <DialogTitle>Backup Code</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please save the backup code below. You will need this code to log in if you lose access to your authenticator app.
                    </DialogContentText>
                    <Box display="flex" justifyContent="center">
                        <Typography variant="h5" marginY={"1rem"}>{backup}</Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowBackup(false)} startIcon={<CloseIcon />}>Close</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showDisable} onClose={() => setShowDisable(false)}>
                <DialogTitle>Disable 2FA</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to disable 2FA? Your account will be less secure.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDisable(false)} startIcon={<CloseIcon />}>Cancel</Button>
                    <LoadingButton loading={loading} loadingPosition='start' onClick={disable2FA} color="error" startIcon={<KeyOffIcon />}>Disable</LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ViewLogins