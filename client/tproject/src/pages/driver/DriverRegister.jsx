import React, { useState, useEffect } from 'react'
import { Box, Typography, TextField, Button, Container, Grid, Stepper, Step, StepLabel, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http'
import { useSnackbar } from 'notistack';
import PageTitle from '../../components/PageTitle';

function DriverRegister() {

    const [faceFile, setFaceFile] = useState();
    const [carFile, setCarFile] = useState();
    const [licenseFile, setLicenseFile] = useState();
    const [icFile, setIcFile] = useState();

    const [faceFileUpload, setFaceFileUpload] = useState();
    const [carFileUpload, setCarFileUpload] = useState();
    const [licenseFileUpload, setLicenseFileUpload] = useState();
    const [icFileUpload, setIcFileUpload] = useState();

    const steps = ["Personal Details", "Car & Documents"];
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({});

    function handleChangeFace(e) {
        setFaceFile(URL.createObjectURL(e.target.files[0]));
        setFaceFileUpload(e.target.files[0]);
    }
    function handleChangeCar(e) {
        setCarFile(URL.createObjectURL(e.target.files[0]));
        setCarFileUpload(e.target.files[0]);
    }
    function handleChangeLicense(e) {
        setLicenseFile(URL.createObjectURL(e.target.files[0]));
        setLicenseFileUpload(e.target.files[0]);
    }
    function handleChangeIc(e) {
        setIcFile(URL.createObjectURL(e.target.files[0]));
        setIcFileUpload(e.target.files[0])

    }
    const uploadAll = async () => {
        let file_array = [];
        let temp_array = []
        file_array.push(faceFileUpload);
        file_array.push(carFileUpload);
        file_array.push(licenseFileUpload);
        file_array.push(icFileUpload);
        for (let index = 0; index < file_array.length; index++) {
            let file = file_array[index];
            if (file) {
                if (file.size > 1024 * 1024) {
                    enqueueSnackbar("File size cannot exceed more than 1MB", { variant: "error" })
                    return;
                }
                let formData = new FormData();
                formData.append('file', file);
                const res = await http.post('/driver/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                console.log("filedata:", res.data);
                temp_array.push(res.data.filename);
        
            }

        }
        console.log("temp array", temp_array)
        return temp_array

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
        onSubmit: async (data) => {
            data.driver_nric_name = formData.driver_nric_name;
            data.driver_nric_number = formData.driver_nric_number;
            data.driver_postalcode = parseInt(formData.driver_postalcode);
            data.driver_age = parseInt(formData.driver_age);
            data.driver_question = formData.driver_question;
            data.driver_car_license_plate = data.driver_car_license_plate.trim();
            data.driver_car_model = data.driver_car_model.trim();

            if (icFile && licenseFile && carFile && faceFile) {
                const file_upload_array = await uploadAll()
                console.log(file_upload_array)
                console.log(file_upload_array[0])
                data.driver_face_image = file_upload_array[0]
                data.driver_car_image = file_upload_array[1]
                data.driver_license = file_upload_array[2]
                data.driver_ic = file_upload_array[3]
                console.log("new Data", data)
                http.post("/driver/register", data)
                    .then((res) => {
                        console.log(res.data);
                        enqueueSnackbar('Driver Application Submitted!', { variant: 'success' });
                        navigate('/')
                    });
            }
            else {
                enqueueSnackbar('Please upload all the required files', { variant: 'error' });
            }

        }
    });
    useEffect(() => {
        console.log("faceFile", faceFile)
        console.log("Upload", faceFileUpload)
    }, [])
    return (
        <Box sx={{
            border: 'solid, black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <PageTitle title="Driver Registration" subtitle="Be a driver with us today!" />
            <Container maxWidth="sm" sx={{ mt: 3, mb: 5 }}>
                <Card>
                    <CardContent>
                        <Stepper activeStep={activeStep} sx={{ margin: "1rem" }} alternativeLabel>
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
                                                    <img src={faceFile} alt="" width="100%" />
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
                                                    <img src={licenseFile} alt="" width="100%" />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Button variant="contained" component="label" fullWidth>
                                                        Upload IC Image
                                                        <input hidden accept="image/*" onChange={handleChangeIc} multiple type="file" />
                                                    </Button>
                                                    <img src={icFile} alt="" width="100%" />
                                                </Grid>
                                            </Grid>
                                            <hr />
                                            <Grid container spacing={2} sx={{ mb: 1 }}>
                                                <Grid item xs={6}>
                                                    <Button
                                                        sx={{ width: 1 / 2 }}
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={handleBack}

                                                    >
                                                        Back
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Button
                                                        sx={{ width: 1 / 2 }}
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
                    </CardContent>
                </Card>

            </Container>
        </Box>
    )
};

export default DriverRegister