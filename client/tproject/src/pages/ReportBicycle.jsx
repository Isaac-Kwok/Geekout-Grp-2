import React, { useEffect, useState} from 'react';
import '../bicycle.css';
import { Box, Container, Card, CardContent, Grid, FormControl, FormControlLabel, RadioGroup, Radio, TextField, CardActions, FormLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import http from '../http';
import PageTitle from '../components/PageTitle';
import CardTitle from '../components/CardTitle';
import SendIcon from '@mui/icons-material/Send';
import { Warning } from '@mui/icons-material';

function ReportBicycle() {
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const getDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so we add 1 and pad with '0'
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const getReports = (bikeId) => {
        http.get(`/bicycle/${bikeId}`).then((res) => {
            if (res.status === 200) {
                const bikeData = res.data;
                const bikeReports = bikeData.reports || 0; // Default to 0 if reports is not available
                setReports(bikeReports);
            } else {
                console.log('Failed to fetch bike reports');
            }
        }).catch((err) => {
            console.error('Error fetching bike reports:', err);
        });
    }

    const formik = useFormik({
        initialValues: {
            report: "",
            reportType: ""
        },
        validationSchema: yup.object({
            report: yup.string().required(),
            reportType: yup.string().required(),
            bike_id: yup.number().optional(),
            reportedAt: yup.date().optional()
        }),
        onSubmit: (data) => {
            setLoading(true);
            data.bike_id = id
            data.reportedAt = getDateTime()
            http.post("/bicycle/reports", data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Bicycle reported succesfully!", { variant: "success" });
                    navigate("/bicycle")

                    http.put("/bicycle/"+id, {reports: reports + 1}).then((res) => {
                        if (res.status === 200) {
                            console.log("Report incremented succesfully")
                        } else {
                            console.log("Failed to increment report")
                        }
                    }).catch((err) => {
                        console.log("Error while incrementing report:", err);
                    })
                } else {
                    enqueueSnackbar("Failed to report bicycle test", { variant: "error" });
                    setLoading(false);
                }
            }).catch((err) => {
                enqueueSnackbar("Failed to report bicycle" + err.response.data.message, { variant: "error" });
                setLoading(false);
            })
        }
    })

    useEffect(() => {
        getReports(id)
    })

    return (
        <>
            <PageTitle title="Report Bicycle" subtitle={id ? "Report a Fault for Bike " + id : "Report a Fault"} />
            <Container maxWidth="lg">
                <Card>
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <CardContent>
                            <CardTitle title="Report Bicycle" icon={<Warning />} />
                            <Grid container spacing={2} marginTop={"0.5rem"}>
                                <Grid item xs={12} md={6}>
                                    <FormControl>
                                        <FormLabel id="reportType-label">Fault Type</FormLabel>
                                        <RadioGroup
                                            aria-labelledby="reportType-label"
                                            defaultValue="missing"
                                            name="reportType"
                                            value={formik.values.reportType}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.reportType && Boolean(formik.errors.reportType)}
                                            helperText={formik.touched.reportType && formik.errors.reportType}
                                        >
                                            <FormControlLabel value="missing" control={<Radio />} label="Missing Bike" />
                                            <FormControlLabel value="damaged" control={<Radio />} label="Damaged Bike" />
                                            <FormControlLabel value="others" control={<Radio />} label="Others..." />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Details/Notes"
                                        name='report'
                                        size="small"
                                        variant="outlined"
                                        sx={{ flexGrow: 1 }}
                                        value={formik.values.report}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.report && Boolean(formik.errors.report)}
                                        helperText={formik.touched.report && formik.errors.report}
                                        multiline
                                        rows={6}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions>
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                loading={loading}
                                startIcon={<SendIcon />}
                                fullWidth
                            >
                                Submit Report
                            </LoadingButton>
                        </CardActions>
                    </Box>

                </Card>
            </Container>
        </>

    );
}

export default ReportBicycle;
