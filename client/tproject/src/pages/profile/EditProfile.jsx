import React, { useState, useEffect } from 'react'
import { Box, Card, CardContent, Button, Stack, Grid, CardActions, TextField, Tabs, Tab } from '@mui/material'
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import BackIcon from '@mui/icons-material/ArrowBack';
import PasswordIcon from '@mui/icons-material/Password';
import PersonIcon from '@mui/icons-material/Person';
import useUser from '../../context/useUser'
import http from '../../http'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

function EditProfile() {

    const [user, setUser] = useState({})
    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(false)
    const { refreshUser } = useUser()
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()

    const editForm = useFormik({
        initialValues: {
            name: user.name || "",
            email: user.email || "",
            phone_number: user.phone_number || "",
            delivery_address: user.delivery_address || "",
        },
        validationSchema: yup.object({
            name: yup.string().required("Required"),
            email: yup.string().email("Invalid email address").required("Required"),
            phone_number: yup.string().required("Required").min(8, "Phone number must be 8 digits").max(8, "Phone number must be 8 digits"),
            delivery_address: yup.string().optional(),
        }),
        onSubmit: (values) => {
            setLoading(true)
            http.put("/user", values).then(res => {
                console.log(res)
                refreshUser()
                enqueueSnackbar("Profile updated successfully", { variant: "success" })
                setLoading(false)
            }).catch(err => {
                enqueueSnackbar("Error updating profile. " + err.response.data.message, { variant: "error" })
            })
        },
        enableReinitialize: true
    })

    const changePasswordForm = useFormik({
        initialValues: {
            password: "",
            confirm_password: "",
        },
        validationSchema: yup.object({
            password: yup.string().required("Required"),
            confirm_password: yup.string().required("Required").oneOf([yup.ref('password'), null], 'Passwords must match'),
        }),
        onSubmit: (values) => {
            setLoading(true)
            http.put("/user", values).then(res => {
                console.log(res)
                refreshUser()
                enqueueSnackbar("Password changed successfully", { variant: "success" })
                setLoading(false)
            }).catch(err => {
                enqueueSnackbar("Error changing password. " + err.response.data.message, { variant: "error" })
            })
        },
        enableReinitialize: true
    })

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    function getUser() {
        http.get("/user").then(res => {
            setUser(res.data)
        })
    }

    useEffect(() => {
        document.title = "EnviroGo - Edit Profile"
        getUser()
    }, [])

    return (
        <>
            <Button variant="outlined" color="primary" onClick={() => { navigate(-1) }} startIcon={<BackIcon />}>Back</Button>
            <Stack direction="column" spacing={2} marginTop={"1rem"}>

                <Card>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleTabChange} aria-label="Edit profile navigation">
                            <Tab label="Edit Profile" icon={<PersonIcon />} iconPosition="start" />
                            <Tab label="Change Password" icon={<PasswordIcon />} iconPosition="start" />
                        </Tabs>
                    </Box>
                    <Box component="form" onSubmit={editForm.handleSubmit} display={value == 0 ? "initial" : "none"}>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="email"
                                        label="E-mail Address"
                                        variant="outlined"
                                        value={editForm.values.email}
                                        onChange={editForm.handleChange}
                                        error={editForm.touched.email && Boolean(editForm.errors.email)}
                                        helperText={editForm.touched.email && editForm.errors.email}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        name="name"
                                        label="Name"
                                        variant="outlined"
                                        value={editForm.values.name}
                                        onChange={editForm.handleChange}
                                        error={editForm.touched.name && Boolean(editForm.errors.name)}
                                        helperText={editForm.touched.name && editForm.errors.name}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        name="phone_number"
                                        label="Phone Number"
                                        variant="outlined"
                                        value={editForm.values.phone_number}
                                        onChange={editForm.handleChange}
                                        error={editForm.touched.phone_number && Boolean(editForm.errors.phone_number)}
                                        helperText={editForm.touched.phone_number && editForm.errors.phone_number}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="delivery_address"
                                        label="Delivery Address"
                                        variant="outlined"
                                        value={editForm.values.delivery_address}
                                        onChange={editForm.handleChange}
                                        error={editForm.touched.delivery_address && Boolean(editForm.errors.delivery_address)}
                                        helperText={editForm.touched.delivery_address && editForm.errors.delivery_address}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions>
                            <LoadingButton loadingPosition="start" loading={loading} type='submit' variant="text" color="primary" startIcon={<EditIcon />}>Edit Profile</LoadingButton>
                        </CardActions>
                    </Box>
                    <Box component="form" onSubmit={changePasswordForm.handleSubmit} display={value == 1 ? "initial" : "none"}>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        variant="outlined"
                                        value={changePasswordForm.values.password}
                                        onChange={changePasswordForm.handleChange}
                                        error={changePasswordForm.touched.password && Boolean(changePasswordForm.errors.password)}
                                        helperText={changePasswordForm.touched.password && changePasswordForm.errors.password}
                                        type='password'
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        name="confirm_password"
                                        label="Confirm Password"
                                        variant="outlined"
                                        value={changePasswordForm.values.confirm_password}
                                        onChange={changePasswordForm.handleChange}
                                        error={changePasswordForm.touched.confirm_password && Boolean(changePasswordForm.errors.confirm_password)}
                                        helperText={changePasswordForm.touched.confirm_password && changePasswordForm.errors.confirm_password}
                                        type='password'
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions>
                            <LoadingButton loadingPosition="start" loading={loading} type='submit' variant="text" color="primary" startIcon={<EditIcon />} >Change Password</LoadingButton>
                        </CardActions>
                    </Box>
                </Card>
            </Stack >
        </>
    )
}

export default EditProfile