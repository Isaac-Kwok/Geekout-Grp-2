import React, { useState, useEffect } from 'react'
import PasswordIcon from '@mui/icons-material/Password';
import { Container, Card, CardActions, CardContent, Stack, Typography, Box, TextField } from '@mui/material'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import http from '../http';
import jwt_decode from "jwt-decode";

function Reset() {
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Reset Password - EnviroGo";
        if (token === null) {
            enqueueSnackbar("Reset failed! Invalid token.1", { variant: "error" });
            return navigate("/login")
        }

        try {
            const decoded = jwt_decode(token);
            if (decoded.type !== "reset" || decoded.exp < Date.now() / 1000 || decoded.id === undefined) {
                enqueueSnackbar("Reset failed! Invalid token.2", { variant: "error" });
                return navigate("/login")
            }
        } catch (err) {
            enqueueSnackbar("Reset failed! Invalid token.3", { variant: "error" });
            return navigate("/login")
        }
    }, []);

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            password: Yup.string().required("Password is required"),
            confirmPassword: Yup.string().required("Confirm Password is required").oneOf([Yup.ref('password'), null], 'Passwords must match'),
        }),
        onSubmit: (data) => {
            setLoading(true);
            data.token = token;
            data.password = data.password.trim();
            http.post("/auth/reset", data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Password reset successful!", { variant: "success" });
                    navigate("/login")
                } else {
                    enqueueSnackbar("Reset failed!", { variant: "error" });
                    setLoading(false);
                }
            }).catch((err) => {
                enqueueSnackbar("Reset failed! " + err.response.data.message, { variant: "error" });
                setLoading(false);
            })
        }
    })

    return (
        <>
            <Container maxWidth="xl" sx={{ marginTop: "1rem" }}>
                <Card sx={{ maxWidth: 500, margin: "auto" }}>
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <CardContent>
                            <Stack direction="row" alignItems={"center"} spacing={2}>
                                <PasswordIcon color="text.secondary" />
                                <Typography sx={{ fontSize: 18, fontWeight: 700 }} color="text.secondary" gutterBottom>
                                    Reset Password
                                </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ marginTop: "1rem" }}>
                                Enter your new password below.
                            </Typography>
                            <Stack spacing={2} sx={{ marginTop: 2 }}>
                                <TextField
                                    type="password"
                                    fullWidth
                                    label="New Password"
                                    variant="outlined"
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
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
                            </Stack>

                        </CardContent>
                        <CardActions>
                            <LoadingButton type="submit" loadingPosition="start" loading={loading} size="small" variant="text" color="primary" startIcon={<RefreshIcon />}>Reset Password</LoadingButton>
                        </CardActions>
                    </Box>
                </Card>
            </Container>
        </>
    )
}

export default Reset