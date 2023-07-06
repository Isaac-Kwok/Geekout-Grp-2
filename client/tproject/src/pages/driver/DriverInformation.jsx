import React, { useState, useEffect, useContext } from 'react'
import { Box, Card, CardContent, Typography, Button, Stack, Grid, Divider, CardActions } from '@mui/material'
import InfoBox from '../../components/InfoBox'
import CardTitle from '../../components/CardTitle'
import TopUpDialog from '../../components/TopUpDialog'
import EditIcon from '@mui/icons-material/Edit';
import ArticleIcon from '@mui/icons-material/Article';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { DriveEta } from '@mui/icons-material'
import { ProfileContext } from '../profile/ProfileRoutes'
import http from '../../http'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs';
import global from '../../global'


function DriverInformation() {
    const { profile, setProfile } = useContext(ProfileContext)
    const driverPath = `${import.meta.env.VITE_API_URL}/admin/driver/driverImage/`
    const [driverApplication, setDriverApplication] = useState();

    function getDriverApplication() {
        http.get("/driver/getDriverApplication").then((res) => {
            if (res.status === 200) {
                setDriverApplication(res.data);
                console.log("data", res.data);
            } else {
                enqueueSnackbar("Driver Application retrieval failed!.", { variant: "error" });
                return navigate(-1);
            }
        })
    }
    useEffect(() => {
        getDriverApplication();
    }, [])
    return (
        <>
            <Stack direction="column" spacing={2}>
            {driverApplication &&
                <Card>
                    <CardContent>
                        <CardTitle icon={<DriveEta />} title="Application Information" />
                        <Grid container spacing={2} marginTop={"1rem"}>
                            <Grid item xs={6} md={4}>
                                <InfoBox title="Date Created" value={dayjs(driverApplication.createdAt).format(global.datetimeFormat)} />
                            </Grid>
                            {driverApplication.driver_status == "Approved" &&
                                <Grid item xs={6} md={4}>
                                    <InfoBox title="Date Approved" value={dayjs(driverApplication.updatedAt).format(global.datetimeFormat)} />
                                </Grid>}
                            {driverApplication.driver_status == "Rejected" &&
                                <Grid item xs={6} md={4}>
                                    <InfoBox title="Date Rejected" value={dayjs(driverApplication.updatedAt).format(global.datetimeFormat)} />
                                </Grid>}

                            <Grid item xs={6} md={4}>
                                <InfoBox title="Application Status" value={driverApplication.driver_status} boolean={driverApplication.driver_status == "Rejected" ? false : true} />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <InfoBox title="Reason" value={"Hello I rejected you"} />
                            </Grid>



                        </Grid>
                    </CardContent>
                </Card>
                }
                {driverApplication &&
                    <Card>
                        <CardContent>
                            <Box display={'flex'}>
                                <Box flexGrow={1}>
                                    <CardTitle icon={<ArticleIcon />} title="Application Form" />
                                </Box>

                                {driverApplication.driver_status == "Rejected" &&
                                    <Button LinkComponent={Link} to="/driver/register" variant="text" color="primary" startIcon={<EditIcon />}>Re-Register Application</Button>
                                }
                            </Box>

                            <Grid container spacing={2} marginTop={"1rem"}>
                                <Grid item xs={6} md={4}>
                                    <InfoBox title="NRIC Name" value={driverApplication.driver_nric_name} />
                                </Grid>
                                <Grid item xs={6} md={4}>
                                    <InfoBox title="NRIC Number" value={driverApplication.driver_nric_number} />
                                </Grid>
                                <Grid item xs={6} md={4}>
                                    <InfoBox title="Phone Number" value={driverApplication.phone_number} />
                                </Grid>
                                <Grid item xs={6} md={4}>
                                    <InfoBox title="Email Address" value={driverApplication.driver_email} />
                                </Grid>
                                <Grid item xs={6} md={4}>
                                    <InfoBox title="Age" value={driverApplication.driver_age} />
                                </Grid>
                                <Grid item xs={6} md={4}>
                                    <InfoBox title="Why I want to be a driver?" value={driverApplication.driver_question} />
                                </Grid>
                                <Grid item xs={6} md={4}>
                                    <InfoBox title="Postal Code" value={driverApplication.driver_postalcode} />
                                </Grid>
                                <Grid item xs={6} md={4}>
                                    <InfoBox title="Car Model" value={driverApplication.driver_car_model} />
                                </Grid>
                                <Grid item xs={6} md={4}>
                                    <InfoBox title="License Plate" value={driverApplication.driver_car_license_plate} />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} marginTop={"1rem"} >
                                <Grid item xs={6} md={4} >
                                    <InfoBox title="Driver Face Image" value="" />
                                    <img src={`${driverPath}${driverApplication.driver_face_image}`} alt="" />
                                </Grid>
                                <Grid item xs={6} md={6} >
                                    <InfoBox title="Driver Car Image" value="" />
                                    <img src={`${driverPath}${driverApplication.driver_car_image}`} alt="" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <InfoBox title="Driver License Image" value="" />
                                    <img src={`${driverPath}${driverApplication.driver_license}`} alt="" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <InfoBox title="Driver IC Image" value="" />
                                    <img src={`${driverPath}${driverApplication.driver_ic}`} alt="" />
                                </Grid>
                            </Grid>

                        </CardContent>
                    </Card>
                }
                {!driverApplication &&
                    <Card>
                        <CardContent>
                            <CardTitle icon={<ArticleIcon />} title="Driver Application" />
                            <Typography>
                                You have not sent a driver applicaiton, click on the link below to apply!
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button LinkComponent={Link} to="/driver/register" variant="text" color="primary" startIcon={<EditIcon />}>Register Driver Application</Button>
                        </CardActions>
                    </Card>
                }
            </Stack>

        </>
    )
}

export default DriverInformation