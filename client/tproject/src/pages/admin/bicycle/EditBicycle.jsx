import React, { useState } from 'react'
import { Container, Card, CardContent, Box, Checkbox, TextField, Grid, FormControlLabel, IconButton } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import CardTitle from "../../../components/CardTitle";
import AdminPageTitle from '../../../components/AdminPageTitle';
import http from '../../../http'
import { useSnackbar } from 'notistack'
import * as yup from "yup";
import { useFormik } from 'formik';

import { useNavigate, useParams } from 'react-router-dom';

function EditBicycle() {
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const { id } = useParams();
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
            registered: yup.boolean().optional(),
            unlocked: yup.boolean().optional(),
            unlockedAt: yup.date().optional()
        }),
        onSubmit: (data) => {
            data.disabled = true
            data.reports = 0
            data.passkey = null
            data.registered = false
            data.unlocked = false
            data.unlockedAt = null
            http.put("/bicycle/" + id, data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Bicycle updated succesfully!", { variant: "success" });
                    navigate("/admin/bicycle/view")
                } else {
                    enqueueSnackbar("Failed to update bicycle test", { variant: "error" });
                    setLoading(false);
                }
            }).catch((err) => {
                enqueueSnackbar("Failed to update bicycle" + err.response.data.message, { variant: "error" });
                setLoading(false);
            })
        }
    })

    return (
        <>
            <Container maxWidth="xl" sx={{ marginTop: "1rem" }}>
                <AdminPageTitle title="Edit Bicycle" backbutton />
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
                    Edit Bicycle
                </LoadingButton>
                <Card sx={{ margin: "auto" }}>
                    <Box component="form">
                        <CardContent>
                            <CardTitle title="Bicycle Coordinates" icon={<PedalBikeIcon color="text.secondary" />} />
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
                                sx={{ marginY: "1rem" }}
                            />
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
                                sx={{ marginY: "1rem" }}
                            />
                        </CardContent>
                    </Box>
                </Card>
            </Container>
        </>
    )
}

export default EditBicycle