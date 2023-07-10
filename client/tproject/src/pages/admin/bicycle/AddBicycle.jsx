import React, { useState } from 'react'
import { Container, Card, CardContent, Box, Checkbox, TextField, Grid, FormControlLabel, IconButton, InputAdornment } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddIcon from '@mui/icons-material/Add';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import CardTitle from "../../../components/CardTitle";
import AdminPageTitle from '../../../components/AdminPageTitle';
import http from '../../../http'
import { useSnackbar } from 'notistack'
import * as yup from "yup";
import { useFormik } from 'formik';

import { useNavigate } from 'react-router-dom';

function AddBicycle() {
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            bicycle_lat: "",
            bicycle_lng: "",
        },
        validationSchema: yup.object({
            bicycle_lat: yup
                .number()
                .min(-90, 'Latitude must be between -90 and 90')
                .max(90, 'Latitude must be between -90 and 90')
                .required('Latitude is required'),
            bicycle_lng: yup
                .number()
                .min(-180, 'Longitude must be between -180 and 180')
                .max(180, 'Longitude must be between -180 and 180')
                .required('Longitude is required'),
            disabled: yup.boolean().optional(),
            reports: yup.number().integer().min(0).optional(),
            passkey: yup.string().nullable().optional(),
            registered: yup.boolean().optional()
        }),
        onSubmit: (data) => {
            data.disabled = true
            data.reports = 0
            data.passkey = null
            data.registered = false
            http.post("/bicycle", data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Bicycle added succesfully!", { variant: "success" });
                    navigate("/admin/bicycle/view")
                } else {
                    enqueueSnackbar("Failed to add bicycle test", { variant: "error" });
                    setLoading(false);
                }
            }).catch((err) => {
                enqueueSnackbar("Failed to add bicycle" + err.response.data.message, { variant: "error" });
                setLoading(false);
            })
        }
    })

    return (
        <>
            <Container maxWidth="xl" sx={{ marginTop: "1rem" }}>
                <AdminPageTitle title="Add Bicycle" backbutton />
                <LoadingButton
                    variant="contained"
                    color="primary"
                    type="submit"
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<AddIcon />}
                    onClick={formik.handleSubmit}
                    sx={{ marginBottom: "1rem" }}
                >
                    Add Bicycle
                </LoadingButton>
                <Card sx={{ margin: "auto" }}>
                    <Box component="form">
                        <CardContent>
                            <CardTitle title="Bicycle Coordinates" icon={<PedalBikeIcon color="text.secondary" />} />
                            <Grid container marginTop={"1rem"} spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        id="bicycle_lat"
                                        name="bicycle_lat"
                                        label="Latitude"
                                        variant="outlined"
                                        value={formik.values.bicycle_lat}
                                        onChange={formik.handleChange}
                                        error={formik.touched.bicycle_lat && Boolean(formik.errors.bicycle_lat)}
                                        helperText={formik.touched.bicycle_lat && formik.errors.bicycle_lat}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="start">° N</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        id="bicycle_lng"
                                        name="bicycle_lng"
                                        label="Longitude"
                                        variant="outlined"
                                        value={formik.values.bicycle_lng}
                                        onChange={formik.handleChange}
                                        error={formik.touched.bicycle_lng && Boolean(formik.errors.bicycle_lng)}
                                        helperText={formik.touched.bicycle_lng && formik.errors.bicycle_lng}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="start">° E</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Box>
                </Card>
            </Container>
        </>
    )
}

export default AddBicycle