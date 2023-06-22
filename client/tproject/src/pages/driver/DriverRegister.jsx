import React, { useState } from 'react'
import { Box, Typography, TextField, Button, Container, Grid, Stepper, Step, StepLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const steps = ["Step 1", "Step 2"];



function DriverRegister() {

    const [faceFile, setFaceFile] = useState();
    const [carFile, setCarFile] = useState();
    const [licenseFile, setLicenseFile] = useState();
    const [icFile, setIcFile] = useState();

    const [faceFileUpload, setFaceFileUpload] = useState();
    const [carFileUpload, setCarFileUpload] = useState();
    const [licenseFileUpload, setLicenseFileUpload] = useState();
    const [icFileUpload, setIcFileUpload] = useState();


    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({});

    function handleChangeFace(e) {
        console.log(e.target.files);
        setFaceFile(URL.createObjectURL(e.target.files[0]));
        setFaceFileUpload(e.target.files[0]);
    }
    function handleChangeCar(e) {
        console.log(e.target.files);
        setCarFile(URL.createObjectURL(e.target.files[0]));
        setCarFileUpload(e.target.files[0]);
    }
    function handleChangeLicense(e) {
        console.log(e.target.files);
        setLicenseFile(URL.createObjectURL(e.target.files[0]));
        setLicenseFileUpload(e.target.files[0]);
    }
    function handleChangeIc(e) {
        console.log(e.target.files);
        setIcFile(URL.createObjectURL(e.target.files[0]));
        setIcFileUpload(e.target.files[0])

    }
    const uploadAll = () => {
        let file_array = [];
        file_array.push(faceFileUpload);
        file_array.push(carFileUpload);
        file_array.push(licenseFileUpload);
        file_array.push(icFileUpload);
        for (let index = 0; index < file_array.length; index++) {
            let file = file_array[index];
            if (file) {
                if (file.size > 1024 * 1024) {
                    toast.error('Maximum file size is 1MB');
                    return;
                }
                let formData = new FormData();
                formData.append('file', file);
                http.post('/driver/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then((res) => {
                        console.log(res.data);
                    })
                    .catch(function (error) {
                        console.log(error.response);
                    });
            }

        }

    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const formik = useFormik({
        initialValues: {
            driver_nric_name: "",
            driver_nric_number: "",
            driver_postalcode: "",
            driver_age: "",
            driver_question: ""
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
    const formik2 = useFormik({
        initialValues: {
            driver_car_model: "",
            driver_car_license_plate: ""

        },
        validationSchema: yup.object().shape({
            driver_car_model: yup.string().trim().required("Car model is a required field"),
            driver_car_license_plate: yup.string().trim().required("Car License plate is a required field"),
        }),
        onSubmit: (data) => {
            data.driver_nric_name = formData.driver_nric_name;
            data.driver_nric_number = formData.driver_nric_number;
            data.driver_postalcode = parseInt(formData.driver_postalcode);
            data.driver_age = parseInt(formData.driver_age);
            data.driver_question = formData.driver_question;
            data.driver_car_license_plate = data.driver_car_license_plate.trim();
            data.driver_car_model = data.driver_car_model.trim();

            data.driver_face_image = faceFile
            data.driver_car_image = carFile
            data.driver_license = licenseFile
            data.driver_ic = icFile

            if (icFile && licenseFile && carFile && faceFile) {
                console.log(data)
                uploadAll()
                http.post("/driver/driverregister", data)
                    .then((res) => {
                        console.log(res.data);
                        navigate('/')
                    });
            }
            else {
                toast.error('Please upload all the neccessary files');
            }

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
            <Typography variant="h5" sx={{ my: 0, mt: 0 }}>
                Register To be a driver
            </Typography>
            <ToastContainer />
            <Container maxWidth="sm" sx={{ mt: 3, mb: 10 }}>
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
                                        inputProps={{ maxLength: 9 }}
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
                                <Box component="form" sx={{ maxWidth: '500px' }} onSubmit={formik2.handleSubmit}>
                                    <TextField
                                        fullWidth margin="normal" autoComplete="off"
                                        label="Car model"
                                        name="driver_car_model"
                                        value={formik2.values.driver_car_model}
                                        onChange={formik2.handleChange}
                                        error={formik2.touched.driver_car_model && Boolean(formik2.errors.driver_car_model)}
                                        helperText={formik2.touched.driver_car_model && formik2.errors.driver_car_model}
                                    />
                                    <TextField
                                        fullWidth margin="normal" autoComplete="off"
                                        label="Car License Plate"
                                        name="driver_car_license_plate"
                                        value={formik2.values.driver_car_license_plate}
                                        onChange={formik2.handleChange}
                                        error={formik2.touched.driver_car_license_plate && Boolean(formik2.errors.driver_car_license_plate)}
                                        helperText={formik2.touched.driver_car_license_plate && formik2.errors.driver_car_license_plate}
                                    />
                                    <Grid container spacing={2} sx={{ mb: 1, mt: 1 }}>
                                        <Grid item xs={6}>
                                            <Button variant="contained" component="label" fullWidth>
                                                Upload Face Image
                                                <input hidden accept="image/*" onChange={handleChangeFace} multiple type="file" />

                                            </Button>
                                            <img src={faceFile} alt="" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button variant="contained" component="label" fullWidth>
                                                Upload Car Image
                                                <input hidden accept="image/*" onChange={handleChangeCar} multiple type="file" />
                                            </Button>
                                            <img src={carFile} alt="" width="100%" />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} sx={{ mb: 3 }}>
                                        <Grid item xs={6}>
                                            <Button variant="contained" component="label" fullWidth>
                                                Upload Driver license
                                                <input hidden accept="image/*" onChange={handleChangeLicense} multiple type="file" />
                                            </Button>
                                            <img src={licenseFile} alt="" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button variant="contained" component="label" fullWidth>
                                                Upload Car Image
                                                <input hidden accept="image/*" onChange={handleChangeIc} multiple type="file" />
                                            </Button>
                                            <img src={icFile} alt="" />
                                        </Grid>
                                    </Grid>
                                    <hr />
                                    <Grid container spacing={2} sx={{ mb: 1 }}>
                                        <Grid item xs={6}>
                                            <Button
                                                sx={{ width: 1/2 }}
                                                variant="contained"
                                                color="secondary"
                                                onClick={handleBack}

                                            >
                                                Back
                                            </Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button
                                                sx={{ width: 1/2 }}
                                                type='submit'
                                                variant="contained"
                                                color="primary"
                                            >
                                                Register
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
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