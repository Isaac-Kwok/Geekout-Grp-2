import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import http from "../../../http";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { TextField, Container, Button, CardHeader, Avatar, Divider, Box, Grid, Paper } from '@mui/material';
import MDEditor from '@uiw/react-md-editor';
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditDriverApplication() {
    const navigate = useNavigate();
    const [driverApplication, setDriverApplication] = useState({});
    const [emailValue, setEmailValue] = useState(`Hello`);
    const [status, setStatus] = useState();
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();

    function getDriverApplication() {
        http.get("/admin/driver/getDriverApplicationById/" + id).then((res) => {
            if (res.status === 200) {
                setDriverApplication(res.data);
            } else {
                enqueueSnackbar("Driver Application retrieval failed!.", { variant: "error" });
                return navigate(-1);
            }
        })
    }
    useEffect(() => {
        getDriverApplication();
    }, [])
    const formik = useFormik({
        initialValues: {
            email: driverApplication.driver_email ? driverApplication.driver_email : "",
            subject: "Driver Application Result"
        },
        validationSchema: yup.object().shape({
            subject: yup.string().trim()
                .min(10, "Minimum of 10 characters for this question")
                .required("Subject is requried"),
        }),
        onSubmit: (data) => {
            data.email = driverApplication.driver_email;
            data.body = emailValue;
            data.status = status;
            console.log("Submission successful", data);
            http.put("/admin/driver/edit/" + id, data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Driver Application updated successfully!", { variant: "success" });
                    navigate("/admin/driver/viewdriverapplications")
                } else {
                    enqueueSnackbar("Driver Application update failed!.", { variant: "error" });
                }
            })
        }
    });
    return (
        <Container>
            <Typography variant="h3" fontWeight={700} sx={{ marginY: ["1rem", "1rem", "2rem"], fontSize: ["2rem", "2rem", "3rem"] }}>Driver Application : {id}</Typography>
            <Grid maxWidth="xl" container spacing={4} sx={{ marginBottom: "100px", marginY: "1rem", minWidth: 0, display: "flex" }}>
                <Grid item xs={6}>
                    <Card sx={{ maxWidth: 500 }}>
                        <CardHeader
                            avatar={
                                <Avatar sx={{ width: 100, height: 100 }}>
                                    <img src={`${import.meta.env.VITE_DRIVER_FILE_BASE_URL}${driverApplication.driver_face_image}`} alt="" />
                                </Avatar>
                            }

                            title={driverApplication.driver_nric_name}
                            subheader={driverApplication.driver_question}
                        />
                        <Divider variant="middle" ></Divider>
                        <CardContent>
                            <Box sx={{ flexGrow: 1 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={7} >

                                        <Typography>
                                            <span>NRIC: </span>
                                            {driverApplication.driver_nric_number}
                                        </Typography>
                                        <hr />
                                    </Grid>
                                    <Grid item xs={5} >

                                        <Typography>
                                            <span>Age: </span>
                                            {driverApplication.driver_age}
                                        </Typography>
                                        <hr />
                                    </Grid>
                                    <Grid item xs={12}>

                                        <Typography>
                                            <span>Email: </span>
                                            {driverApplication.driver_email}
                                        </Typography>
                                        <hr />
                                    </Grid>
                                    <Grid item xs={12}>

                                        <Typography>
                                            <span>Phone Number: </span>
                                            {driverApplication.driver_phone_number}
                                        </Typography>
                                        <hr />
                                    </Grid>
                                    <Grid item xs={6}>

                                        <Typography>
                                            <span>License Plate: </span>
                                            {driverApplication.driver_car_license_plate}
                                        </Typography>
                                        <hr />
                                    </Grid>
                                    <Grid item xs={6}>

                                        <Typography>
                                            <span>Postal Code: </span>
                                            {driverApplication.driver_postalcode}
                                        </Typography>
                                        <hr />
                                    </Grid>

                                    <Grid item xs={12}>

                                        <Typography>
                                            <span>Car Model: </span>
                                            {driverApplication.driver_car_model}
                                        </Typography>
                                        <hr />
                                    </Grid>

                                </Grid>
                                <CardMedia
                                    sx={{ maxHeight: "250px" }}
                                    component="img"
                                    alt="car image"
                                    height="auto"
                                    image={`${import.meta.env.VITE_DRIVER_FILE_BASE_URL}${driverApplication.driver_car_image}`}

                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card sx={{ maxWidth: 500 }}>
                        <CardContent>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography>
                                    <b>Driver Identification Card</b>
                                </Typography>
                                <CardMedia
                                    sx={{ maxHeight: "300px" }}
                                    component="img"
                                    alt="driver IC"
                                    height="auto"
                                    image={`${import.meta.env.VITE_DRIVER_FILE_BASE_URL}${driverApplication.driver_ic}`}
                                />
                                <Divider variant="middle" sx={{ marginTop: 2, marginBottom: 2 }} ></Divider>
                                <Typography>
                                    <b>Driver License</b>
                                </Typography>
                                <CardMedia
                                    sx={{ maxHeight: "300px" }}
                                    component="img"
                                    alt="driver license"
                                    height="auto"
                                    image={`${import.meta.env.VITE_DRIVER_FILE_BASE_URL}${driverApplication.driver_license}`}
                                />
                                <br />
                                <Divider></Divider>
                                <Box component="form" onSubmit={formik.handleSubmit}>
                                    <Grid sx={{ marginTop: "1em", marginBottom: "1em" }} container spacing={2}>

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                id="outlined"
                                                label="To:"
                                                name='email'
                                                value={driverApplication.driver_email ? driverApplication.driver_email: ""}

                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                id="outlined"
                                                label="Subject:"
                                                name='subject'
                                                value={formik.values.subject}
                                                onChange={formik.handleChange}
                                                error={formik.touched.subject && Boolean(formik.errors.subject)}
                                                helperText={formik.touched.subject && formik.errors.subject}

                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <MDEditor
                                                value={emailValue}
                                                onChange={setEmailValue}
                                            />
                                            <MDEditor.Markdown style={{ whiteSpace: 'pre-wrap' }} />
                                        </Grid>
                                        <Grid item xs={6}><Button type='submit' fullWidth variant='contained' color='error' onClick={() => setStatus('Rejected')}>Reject</Button></Grid>
                                        <Grid item xs={6}><Button type='submit' fullWidth variant='contained' color='success' onClick={() => setStatus('Approved')}>Approve</Button></Grid>
                                    </Grid>

                                </Box>

                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

export default EditDriverApplication