import { Box, Button, Container, Card, CardContent, CardActions, Stack, Typography, TextField } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton';
import LoginIcon from '@mui/icons-material/Login';
import AddIcon from '@mui/icons-material/Add';
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
    const { setUser } = useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Login - EnviroGo";
    }, []);

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
                    enqueueSnackbar("Login successful!", { variant: "success" });
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
        <Container maxWidth="xl" sx={{marginTop: "1rem"}}>
            <Card variant="outlined" sx={{ maxWidth: 500, margin: "auto" }}>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <CardContent>
                        <Stack direction="row" alignItems={"center"} spacing={2}>
                            <LoginIcon color="text.secondary" />
                            <Typography sx={{ fontSize: 18, fontWeight: 700 }} color="text.secondary" gutterBottom>
                                Login
                            </Typography>
                        </Stack>
                        <Stack spacing={2} sx={{ marginTop: 2 }}>
                            <TextField
                                type="email"
                                fullWidth
                                label="E-mail"
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
                                    sx={{ marginRight: "1rem" }}
                                />
                                <Button>Forget?</Button>
                            </Box>

                        </Stack>
                    </CardContent>
                    <CardActions>
                        <LoadingButton type="submit" loadingPosition="start" loading={loading} size="small" variant="text" color="primary" startIcon={<LoginIcon />}>Login</LoadingButton>
                        <Button size="small" variant="text" color="primary" href="/" startIcon={<AddIcon />} LinkComponent={Link} to="/register">Register</Button>
                    </CardActions>
                </Box>
            </Card>

        </Container>
    )
}

export default Login