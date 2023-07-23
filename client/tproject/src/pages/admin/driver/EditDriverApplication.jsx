import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import http from "../../../http";
import { TextField, Container, Button, CardHeader, Avatar, Divider, Box, Grid, Typography, CardMedia, CardContent, Card } from '@mui/material';
import MDEditor from '@uiw/react-md-editor';
import { useFormik } from 'formik';
import * as yup from 'yup';
import AdminPageTitle from '../../../components/AdminPageTitle';
import CardTitle from '../../../components/CardTitle';
import { Badge, MarkEmailRead } from '@mui/icons-material';


function EditDriverApplication() {
    const navigate = useNavigate();
    const [driverApplication, setDriverApplication] = useState({
        driver_email: "",
        driver_nric_name: "",
        driver_phone_number: "",
        driver_address: "",
        driver_car_model: "",
        driver_postalcode: "",
        driver_nric_number: "",
        driver_age: "",
        driver_car_license_plate: "",
    });
    const [emailValue, setEmailValue] = useState(`Hello`);
    const [status, setStatus] = useState();
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const driverPath = `${import.meta.env.VITE_API_URL}/admin/driver/driverImage/`

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
            setLoading(true);
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
            }).catch((err) => {
                enqueueSnackbar("Driver Application update failed!.", { variant: "error" });
                setLoading(false);
            })
        }
    });
    return (
        <Container maxWidth="xl" sx={{ marginY: "1rem" }}>
            <AdminPageTitle title="Edit Driver Application" subtitle={"Application ID: " + id} backbutton />
            <Grid container spacing={4} sx={{ marginBottom: "100px", minWidth: 0, display: "flex" }}>
                <Grid item xs={12} lg={6}>
                    <Card>
                        <CardHeader
                            avatar={
                                <Avatar sx={{ width: 100, height: 100 }} src={`${driverPath}${driverApplication.driver_face_image}`} />
                            }

                            title={driverApplication.driver_nric_name}
                            subheader={driverApplication.driver_question}
                        />
                        <Divider variant="middle" ></Divider>
                        <CardContent>
                            <Box sx={{ flexGrow: 1 }}>
                                <Grid container spacing={2} marginBottom={"1rem"}>
                                    <Grid item xs={8} >
                                        <TextField fullWidth label="NRIC" value={driverApplication.driver_nric_number} inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={4} >
                                        <TextField fullWidth label="Age" value={driverApplication.driver_age} inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="E-mail Address" value={driverApplication.driver_email} inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="Phone Number" value={driverApplication.driver_phone_number} inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <TextField fullWidth label="Nationality" value={driverApplication.driver_nationality} inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField fullWidth label="Sex" value={driverApplication.driver_sex} inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <TextField fullWidth label="Car License Number" value={driverApplication.driver_car_license_plate} inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField fullWidth label="Postal Code" value={driverApplication.driver_postalcode} inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="Car Model" value={driverApplication.driver_car_model} inputProps={{ readOnly: true }} />
                                    </Grid>
                                </Grid>
                                <Typography fontWeight={700}>Car Image</Typography>
                                <CardMedia
                                    sx={{ maxHeight: "250px", objectFit: "contain" }}
                                    component="img"
                                    alt="car image"
                                    height="auto"
                                    image={`${driverPath}${driverApplication.driver_car_image}`}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ flexGrow: 1 }}>
                                <CardTitle title="Identification Images" icon={<Badge />} />
                                <Box marginTop={"1rem"}>
                                    <Typography fontWeight={700}>Driver Identification Card</Typography>
                                    <CardMedia
                                        sx={{ maxHeight: "300px", objectFit: "contain" }}
                                        component="img"
                                        alt="driver IC"
                                        height="auto"
                                        image={`${driverPath}${driverApplication.driver_ic}`}

                                    />
                                    <Divider variant="middle" sx={{ marginTop: 2, marginBottom: 2 }} ></Divider>
                                    <Typography fontWeight={700}>Driver License</Typography>
                                    <CardMedia
                                        sx={{ maxHeight: "300px", objectFit: "contain" }}
                                        component="img"
                                        alt="driver license"
                                        height="auto"
                                        image={`${driverPath}${driverApplication.driver_license}`}
                                    />
                                </Box>


                                <Divider sx={{ marginBottom: "1rem" }} />
                                <Box component="form" onSubmit={formik.handleSubmit}>
                                    <CardTitle title="Decide & Send Email" icon={<MarkEmailRead />} />
                                    <Grid sx={{ marginTop: "0.25rem" }} container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                id="outlined"
                                                label="To"
                                                name='email'
                                                value={driverApplication.driver_email ? driverApplication.driver_email : ""}

                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                id="outlined"
                                                label="Subject"
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
                                                data-color-mode='light'
                                            />
                                        </Grid>
                                        <Grid item xs={6}><Button type='submit' disabled={loading} fullWidth variant='contained' color='error' onClick={() => setStatus('Rejected')}>Reject</Button></Grid>
                                        <Grid item xs={6}><Button type='submit' disabled={loading} fullWidth variant='contained' color='success' onClick={() => setStatus('Approved')}>Approve</Button></Grid>
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