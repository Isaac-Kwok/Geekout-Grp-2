import { Box, Button, Container, Card, CardContent, CardActions, Stack, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Grid, Divider } from "@mui/material"
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from '@greatsumini/react-facebook-login';
import CardTitle from "../components/CardTitle";
import LoadingButton from '@mui/lab/LoadingButton';
import LoginIcon from '@mui/icons-material/Login';
import AddIcon from '@mui/icons-material/Add';
import HelpIcon from '@mui/icons-material/Help';
import RefreshIcon from '@mui/icons-material/Refresh';
import LockResetIcon from '@mui/icons-material/LockReset';
import CloseIcon from '@mui/icons-material/Close';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useEffect, useState, useContext } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import http from "../http";
import { UserContext } from "..";

function Login() {
    const [loading, setLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [resetPasswordDialog, setResetPasswordDialog] = useState(false);
    const [resendDialog, setResendDialog] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginType, setLoginType] = useState("email");
    const [accessToken, setAccessToken] = useState("");
    const [otpDialog, setOtpDialog] = useState(false);
    const { setUser } = useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Login - EnviroGo";
    }, []);

    const handleResetPasswordDialog = () => {
        setResetPasswordDialog(true);
    }

    const handleResetPasswordDialogClose = () => {
        setResetPasswordDialog(false);
    }

    const handleResendDialog = () => {
        setResendDialog(true);
    }

    const handleResendDialogClose = () => {
        setResendDialog(false);
    }

    const handleOtpDialogClose = () => {
        setAccessToken(null);
        setOtpDialog(false);
    }

    const handleFacebookSuccess = async (res) => {
        setLoading(true);
        setLoginType("facebook");
        console.log(res);
        http.post("/auth/facebook", { token: res.accessToken }).then((res) => {
            if (res.status === 200) {
                enqueueSnackbar("Login successful. Welcome back!", { variant: "success" });
                // Store token in local storage
                localStorage.setItem("token", res.data.token);
                // Set user context
                setUser(res.data.user);
                navigate("/")
            } else {
                enqueueSnackbar("Login failed! " + err.response.data.message, { variant: "error" });
                setLoading(false);
            }
        }).catch((err) => {
            if (err.response.status === 409) {
                setAccessToken(res.accessToken);
                setOtpDialog(true);
                setLoading(false);
            } else {
                enqueueSnackbar("Login failed! " + err.response.data.message, { variant: "error" });
                setLoading(false);
            }
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



    const googleAuth = useGoogleLogin({
        onSuccess: async (res) => {
            setLoading(true);
            setLoginType("google");
            http.post("/auth/google", { token: res.access_token }).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Login successful. Welcome back!", { variant: "success" });
                    // Store token in local storage
                    localStorage.setItem("token", res.data.token);
                    // Set user context
                    setUser(res.data.user);
                    navigate("/")
                } else {
                    enqueueSnackbar("Login failed! " + err.response.data.message, { variant: "error" });
                    setLoading(false);
                }
            }).catch((err) => {
                if (err.response.status === 409) {
                    setAccessToken(res.access_token);
                    setOtpDialog(true);
                    setLoading(false);
                } else {
                    enqueueSnackbar("Login failed! " + err.response.data.message, { variant: "error" });
                    setLoading(false);
                }
            })
        },
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Required"),
            password: Yup.string().required("Password is required"),
        }),
        onSubmit: (data) => {
            setLoading(true);
            data.email = data.email.trim();
            data.password = data.password.trim();
            http.post("/auth", data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Login successful. Welcome back!", { variant: "success" });
                    // Store token in local storage
                    localStorage.setItem("token", res.data.token);
                    // Set user context
                    setUser(res.data.user);
                    navigate("/")
                } else {
                    enqueueSnackbar("Login failed! Check your e-mail and password.", { variant: "error" });
                    setLoading(false);
                }
            }).catch((err) => {
                if (err.response.status === 409) {
                    setEmail(data.email);
                    setPassword(data.password);
                    setOtpDialog(true);
                    setLoading(false);
                } else {
                    enqueueSnackbar("Login failed! " + err.response.data.message, { variant: "error" });
                    setLoading(false);
                }
            })
        }

    })

    const resetFormik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Required"),
        }),
        onSubmit: (data) => {
            setResetLoading(true);
            data.email = data.email.trim();
            http.post("/auth/forgot", data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Password reset e-mail sent!", { variant: "success" });
                    setResetPasswordDialog(false);
                    setResetLoading(false);
                } else {
                    enqueueSnackbar("Password reset failed! Check your e-mail.", { variant: "error" });
                    setResetLoading(false);
                }
            }).catch((err) => {
                enqueueSnackbar("Password reset failed! " + err.response.data.message, { variant: "error" });
                setResetLoading(false);
            })
        }
    })

    const resendFormik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Required"),
        }),
        onSubmit: (data) => {
            setResendLoading(true);
            data.email = data.email.trim();
            http.post("/auth/resend", data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Verification e-mail sent!", { variant: "success" });
                    setResendDialog(false);
                    setResendLoading(false);
                } else {
                    enqueueSnackbar("Verification e-mail failed! Check your e-mail.", { variant: "error" });
                    setResendLoading(false);
                }
            }).catch((err) => {
                enqueueSnackbar("Verification e-mail failed! " + err.response.data.message, { variant: "error" });
                setResendLoading(false);
            })
        }
    })

    const otpFormik = useFormik({
        initialValues: {
            code: "",
        },
        validationSchema: Yup.object({
            code: Yup.string().required("OTP code is required").min(6, "OTP code must be at least 6 characters").max(15, "OTP code cannot be longer than 15 characters"),
        }),
        onSubmit: (data) => {
            setLoading(true);
            if (accessToken) {
                data.token = accessToken;
            } else {
                data.email = email;
                data.password = password;
            }
            const path = accessToken ? loginType == "google" ? "/auth/google" : "/auth/facebook" : "/auth";
            http.post(path, data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Login successful. Welcome back!", { variant: "success" });
                    // Store token in local storage
                    localStorage.setItem("token", res.data.token);
                    // Set user context
                    setUser(res.data.user);
                    navigate("/")
                } else {
                    enqueueSnackbar("Login failed! Check your e-mail and password.", { variant: "error" });
                    setLoading(false);
                }
            }).catch((err) => {
                enqueueSnackbar("Login failed! " + err.response.data.message, { variant: "error" });
                setLoading(false);
            })
        }
    })

    return (
        <>
            <Container maxWidth="xl" sx={{ marginY: "1rem" }}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} md={5} lg={4}>
                        <Card sx={{ margin: "auto" }}>
                            <Box component="form" onSubmit={formik.handleSubmit}>
                                <CardContent>
                                    <CardTitle title="Login (layout NOT final)" icon={<LoginIcon color="text.secondary" />} />
                                    <Stack spacing={2} sx={{ marginTop: 2 }}>
                                        <TextField
                                            type="email"
                                            fullWidth
                                            label="E-mail Address"
                                            variant="outlined"
                                            name="email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            error={formik.touched.email && Boolean(formik.errors.email)}
                                            helperText={formik.touched.email && formik.errors.email}
                                        />
                                        <Box sx={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}>
                                            <TextField
                                                type="password"
                                                fullWidth
                                                label="Password"
                                                variant="outlined"
                                                name="password"
                                                value={formik.values.password}
                                                onChange={formik.handleChange}
                                                error={formik.touched.password && Boolean(formik.errors.password)}
                                                helperText={formik.touched.password && formik.errors.password}
                                            />
                                        </Box>

                                    </Stack>
                                </CardContent>
                                <CardActions>
                                    <LoadingButton type="submit" loadingPosition="start" loading={loading} size="small" variant="text" color="primary" startIcon={<LoginIcon />}>Login</LoadingButton>
                                    <Button size="small" variant="text" color="primary" href="/" startIcon={<AddIcon />} LinkComponent={Link} to="/register">Register</Button>
                                </CardActions>
                            </Box>
                            <Divider />
                            <CardContent>
                                <Stack spacing={1}>
                                    <Button variant="outlined" color="primary" startIcon={<GoogleIcon />} fullWidth onClick={googleAuth}>Login with Google</Button>
                                    <FacebookLogin
                                        appId={import.meta.env.VITE_FACEBOOK_APP_ID}
                                        onSuccess={handleFacebookSuccess}
                                        onFail={handleFacebookFailure}
                                        render={({ onClick, logout }) => (
                                            <Button variant="outlined" color="primary" startIcon={<FacebookIcon />} onClick={onClick} fullWidth>Login with Facebook</Button>
                                        )}
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={5} lg={4}>
                        <Card sx={{ margin: "auto" }}>
                            <CardContent>
                                <CardTitle title="Trouble Logging In?" icon={<HelpIcon color="text.secondary" />} />
                                <Typography variant="body2" sx={{ marginTop: 2 }}>
                                    If you have forgotten your password, you can reset it by clicking the button below.
                                </Typography>
                                <Button sx={{ marginTop: 2 }} variant="outlined" color="primary" onClick={handleResetPasswordDialog}>Reset Password</Button>
                                <Divider sx={{ marginTop: 2 }} />
                                <Typography variant="body2" sx={{ marginTop: 2 }}>
                                    If you have not received your verification e-mail, you can resend it by clicking the button below.
                                </Typography>
                                <Button sx={{ marginTop: 2 }} variant="outlined" color="primary" onClick={handleResendDialog}>Resend Verification E-mail</Button>
                                <Divider sx={{ marginTop: 2 }} />
                                <Typography variant="body2" sx={{ marginTop: 2 }}>
                                    For other issues such as 2FA, please contact us via the support page.
                                </Typography>
                                <Button sx={{ marginTop: 2 }} variant="outlined" color="primary" LinkComponent={Link} to="/support">Go to support</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Dialog open={resetPasswordDialog} onClose={handleResetPasswordDialogClose}>
                <DialogTitle>Forgot Password</DialogTitle>
                <Box component="form" onSubmit={resetFormik.handleSubmit}>
                    <DialogContent sx={{ paddingTop: 0 }}>
                        <DialogContentText>
                            To reset your password, please enter your e-mail address below. We will send you a link to reset your password.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="email"
                            label="E-mail Address"
                            type="email"
                            name="email"
                            fullWidth
                            variant="standard"
                            value={resetFormik.values.email}
                            onChange={resetFormik.handleChange}
                            error={resetFormik.touched.email && Boolean(resetFormik.errors.email)}
                            helperText={resetFormik.touched.email && resetFormik.errors.email}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleResetPasswordDialogClose} startIcon={<CloseIcon />}>Cancel</Button>
                        <LoadingButton type="submit" loadingPosition="start" loading={resetLoading} variant="text" color="primary" startIcon={<LockResetIcon />}>Reset</LoadingButton>
                    </DialogActions>
                </Box>
            </Dialog>
            <Dialog open={resendDialog} onClose={handleResendDialogClose}>
                <DialogTitle>Resend Verification E-mail</DialogTitle>
                <Box component="form" onSubmit={resendFormik.handleSubmit}>
                    <DialogContent sx={{ paddingTop: 0 }}>
                        <DialogContentText>
                            To resend your verification e-mail, please enter your e-mail address below. We will send you a link to verify your account.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="email"
                            label="E-mail Address"
                            type="email"
                            name="email"
                            fullWidth
                            variant="standard"
                            value={resendFormik.values.email}
                            onChange={resendFormik.handleChange}
                            error={resendFormik.touched.email && Boolean(resendFormik.errors.email)}
                            helperText={resendFormik.touched.email && resendFormik.errors.email}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleResendDialogClose} startIcon={<CloseIcon />}>Cancel</Button>
                        <LoadingButton type="submit" loadingPosition="start" loading={resendLoading} variant="text" color="primary" startIcon={<RefreshIcon />}>Resend E-mail</LoadingButton>
                    </DialogActions>
                </Box>
            </Dialog>
            <Dialog open={otpDialog} onClose={handleOtpDialogClose}>
                <DialogTitle>Two-Factor Authentication</DialogTitle>
                <Box component="form" onSubmit={otpFormik.handleSubmit}>
                    <DialogContent sx={{ paddingTop: 0 }}>
                        <DialogContentText>
                            Please enter the 6-digit code from your authenticator app below. if you have lost access to your authenticator app, please enter the backup code.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="code"
                            label="6-digit Code or Backup Code"
                            type="text"
                            name="code"
                            fullWidth
                            variant="standard"
                            value={otpFormik.values.code}
                            onChange={otpFormik.handleChange}
                            error={otpFormik.touched.code && Boolean(otpFormik.errors.code)}
                            helperText={otpFormik.touched.code && otpFormik.errors.code}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleOtpDialogClose} startIcon={<CloseIcon />}>Cancel</Button>
                        <LoadingButton type="submit" loadingPosition="start" loading={loading} variant="text" color="primary" startIcon={<LockResetIcon />}>Verify</LoadingButton>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}

export default Login