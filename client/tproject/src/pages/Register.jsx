import { Container, Card, CardContent, CardActions, Stack, Typography, TextField, Box, Grid } from "@mui/material"
import CardTitle from "../components/CardTitle";
import LoadingButton from '@mui/lab/LoadingButton';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import http from "../http";

function Register() {
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Register - EnviroGo";
    }, []);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
            phone_number: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Required"),
            password: Yup.string().required("Password is required"),
            confirmPassword: Yup.string().required("Confirm Password is required").oneOf([Yup.ref('password'), null], 'Passwords must match'),
            name: Yup.string().required("Name is required"),
            phone_number: Yup.string().required("Phone number is required").max(8, "Phone number must be 8 digits").min(8, "Phone number must be 8 digits"),
        }),
        onSubmit: (data) => {
            setLoading(true);
            data.email = data.email.trim();
            data.password = data.password.trim();
            data.name = data.name.trim();
            data.phone_number = data.phone_number.trim();
            http.post("/auth/register", data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Registration successful! Check your inbox for the activation email", { variant: "success" });
                    navigate("/login")
                } else {
                    enqueueSnackbar("Registration failed! Check your e-mail and password.", { variant: "error" });
                    setLoading(false);
                }
            }).catch((err) => {
                enqueueSnackbar("Registration failed! " + err.response.data.message, { variant: "error" });
                setLoading(false);
            })
        }
    })

    return (
        <Container maxWidth="xl" sx={{ marginY: "1rem" }}>
            <Card sx={{ maxWidth: 750, margin: "auto" }}>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <CardContent>
                        <CardTitle title="Register an account" icon={<PersonAddIcon />} back="/login" />
                        <Stack spacing={2} sx={{ marginY: 2 }}>
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
                            <TextField
                                type="text"
                                fullWidth
                                label="Name"
                                variant="outlined"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                            <TextField
                                type="text"
                                fullWidth
                                label="Phone Number"
                                variant="outlined"
                                name="phone_number"
                                value={formik.values.phone_number}
                                onChange={formik.handleChange}
                                error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
                                helperText={formik.touched.phone_number && formik.errors.phone_number}
                            />

                        </Stack>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
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
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    type="password"
                                    fullWidth
                                    label="Confirm Password"
                                    variant="outlined"
                                    name="confirmPassword"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <LoadingButton type="submit" loadingPosition="start" loading={loading} size="small" variant="text" color="primary" startIcon={<AddIcon />}>Register</LoadingButton>
                    </CardActions>
                </Box>
            </Card>

        </Container>
    )
}

export default Register