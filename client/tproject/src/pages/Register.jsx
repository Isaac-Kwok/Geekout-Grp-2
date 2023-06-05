import { Container, Card, CardContent, CardActions, Stack, Typography, TextField, Box } from "@mui/material"
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
            name: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Required"),
            password: Yup.string().required("Password is required"),
            name: Yup.string().required("Name is required"),
        }),
        onSubmit: (data) => {
            setLoading(true);
            data.email = data.email.trim();
            data.password = data.password.trim();
            data.name = data.name.trim();
            http.post("/user", data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Registration successful!", { variant: "success" });
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
        <Container maxWidth="xl" sx={{marginTop: "1rem"}}>
            <Card variant="outlined" sx={{ maxWidth: 500, margin: "auto" }}>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <CardContent>
                        <Stack direction="row" alignItems={"center"} spacing={2}>
                            <PersonAddIcon color="text.secondary" />
                            <Typography sx={{ fontSize: 18, fontWeight: 700 }} color="text.secondary" gutterBottom>
                                Register
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
                        </Stack>
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