import React, { useState } from 'react'
import { Box, Typography, TextField, Button, Container, Grid, Stepper, Step, StepLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import AspectRatio from '@mui/joy/AspectRatio';


const steps = ["Step 1", "Step 2"];



function DriverRegister() {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({});

    const uploadFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }
            let formData = new FormData();
            formData.append('file', file);
            http.post('/driver/uploadDriverFaceImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setImageFile(res.data.filename);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };
    const formik = useFormik({
        initialValues: {
            driver_nric_name: "",
            driver_nric_number: "",
        },
        validationSchema: yup.object().shape({
            driver_nric_name: yup.string().trim()
                .matches(/^[a-z ,.'-]+$/i, 'Invalid name')
                .min(3, 'Name must be at least 3 characters')
                .max(50, 'Name must be at most 50 characters')
                .required('Name is required'),
            driver_nric_number: yup.string().trim()
                .min(9, "NRIC number has to be 9 characters long")
                .max(9, "NRIC number has to be 9 characters long")
                .required("NRIC number is required"),
            driver_postalcode: yup.number('Value has to be numeric').required("Postal Code is required").typeError('Value must be numeric')
            ,
            driver_age: yup.number('Value has to be numeric').required("Age is required").typeError('Value must be numeric'),
            driver_question: yup.string().trim()
                .min(10, "Minimum of 10 words for this question")
                .max(300, "Maximum of 300 words for this question")
                .required("Your answer is requried")
        }),
        onSubmit: (data) => {
            setFormData(data);
            console.log(data);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    });
    return (
        <Box sx={{
            border: 'solid, black',
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Register
            </Typography>
            <ToastContainer />
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Grid container direction="column" alignItems="center" spacing={2}>
                    <Grid item xs={12}>
                        {activeStep === 0 && (
                            <>
                                <Typography variant="h6">Tell us about yourself</Typography>
                                <Box component="form" sx={{ maxWidth: '500px' }} onSubmit={formik.handleSubmit}>
                                    <TextField
                                        fullWidth margin="normal" autoComplete="off"
                                        label="NRIC Name"
                                        name="driver_nric_name"
                                        value={formik.values.driver_nric_name}
                                        onChange={formik.handleChange}
                                        error={formik.touched.driver_nric_name && Boolean(formik.errors.driver_nric_name)}
                                        helperText={formik.touched.driver_nric_name && formik.errors.driver_nric_name}
                                    />
                                    <TextField
                                        fullWidth margin="normal" autoComplete="off"
                                        label="NRIC Number"
                                        name="driver_nric_number"
                                        value={formik.values.driver_nric_number}
                                        onChange={formik.handleChange}
                                        error={formik.touched.driver_nric_number && Boolean(formik.errors.driver_nric_number)}
                                        helperText={formik.touched.driver_nric_number && formik.errors.driver_nric_number}
                                    />
                                    <Grid container spacing={2}>
                                        <Grid item xs={8}>
                                            <TextField
                                                inputProps={{ maxLength: 6 }}
                                                fullWidth margin="normal" autoComplete="off"
                                                label="Postal Code"
                                                name="driver_postalcode"
                                                value={formik.values.driver_postalcode}
                                                onChange={formik.handleChange}
                                                error={formik.touched.driver_postalcode && Boolean(formik.errors.driver_postalcode)}
                                                helperText={formik.touched.driver_postalcode && formik.errors.driver_postalcode}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                inputProps={{ maxLength: 4 }}
                                                fullWidth margin="normal" autoComplete="off"
                                                label="Age"
                                                name="driver_age"
                                                value={formik.values.driver_age}
                                                onChange={formik.handleChange}
                                                error={formik.touched.driver_age && Boolean(formik.errors.driver_age)}
                                                helperText={formik.touched.driver_age && formik.errors.driver_age}
                                            />
                                        </Grid>
                                    </Grid>
                                    <TextField
                                        multiline
                                        maxRows={Infinity}
                                        minRows={8}
                                        fullWidth margin="normal" autoComplete="off"
                                        label="Why do you want to be a driver?"
                                        name="driver_question"
                                        value={formik.values.driver_question}
                                        onChange={formik.handleChange}
                                        error={formik.touched.driver_question && Boolean(formik.errors.driver_question)}
                                        helperText={formik.touched.driver_question && formik.errors.driver_question}
                                    />


                                    <Button fullWidth variant="contained" sx={{ mt: 2 }}
                                        type="submit">
                                        Next
                                    </Button>
                                </Box>

                            </>
                        )}
                        {activeStep === 1 && (
                            <>
                                <Typography variant="h6">Driver details</Typography>

                                <TextField
                                    label="Email"
                                    name="email"
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <Box sx={{ textAlign: 'center', mt: 2 }} >
                                    <Button variant="contained" component="label">
                                        Upload Image
                                        <input hidden accept="image/*" onChange={uploadFileChange} multiple type="file" />
                                    </Button>
                                </Box>
                                {
                                    imageFile && (
                                        <AspectRatio sx={{ mt: 2 }}>
                                            <Box component="img" alt="tutorial"
                                                src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}>
                                            </Box>
                                        </AspectRatio>
                                    )
                                }
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    disabled={activeStep === steps.length - 1}
                                >
                                    {activeStep === steps.length - 1 ? "Submit" : "Next"}
                                </Button>
                            </>
                        )}
                    </Grid>
                </Grid>
            </Container>
            <ToastContainer />
        </Box>


    )
};

export default DriverRegister