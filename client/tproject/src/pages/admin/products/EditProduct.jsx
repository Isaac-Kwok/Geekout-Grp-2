import React, { useState, useEffect } from 'react'
import { Container, Typography, Card, CardContent, CardActions, Box, Stack, Checkbox, InputAdornment, TextField, Grid, FormControlLabel, FormControl, IconButton, InputLabel, Select, MenuItem, Button, Dialog, DialogContent, DialogActions, DialogContentText, DialogTitle, Link, Input } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import CardTitle from '../../../components/CardTitle';
import { useNavigate, useParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PublicIcon from '@mui/icons-material/Public';
import http from '../../../http'
import MDEditor from '@uiw/react-md-editor';

import { useSnackbar } from 'notistack'
import * as Yup from "yup";
import { useFormik } from 'formik';
import ProfilePicture from '../../../components/ProfilePicture';
import md5 from "md5";

function EditProduct() {
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingPicture, setLoadingPicture] = useState(false);
    const [changePictureDialog, setChangePictureDialog] = useState(false);
    const [descriptionValue, setDescriptionValue] = useState();
    const { enqueueSnackbar } = useSnackbar();

    const handleChangePictureDialogClose = () => {
        setChangePictureDialog(false);
    }

    const handleChangePictureDialogOpen = () => {
        setChangePictureDialog(true);
    }
    
    // Uploading of Pictures to be updated as they are unable to work
    const handlePictureChange = (e) => {
        setLoadingPicture(true);
        console.log(e);
        const formData = new FormData();
        formData.append("profile_picture", e.target.files[0]);
        http.post("/admin/users/" + id + "/upload", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((res) => {
            if (res.status === 200) {
                enqueueSnackbar("Profile picture updated successfully!", { variant: "success" });
                setUser(res.data);
                setLoadingPicture(false);
                handleChangePictureDialogClose();
            } else {
                enqueueSnackbar("Profile picture update failed!", { variant: "error" });
                setLoadingPicture(false);
                handleChangePictureDialogClose();
            }
        }).catch((err) => {
            enqueueSnackbar("Profile picture update failed! " + err.response.data.message, { variant: "error" });
            setLoadingPicture(false);
            handleChangePictureDialogClose();
        })
    }

    function handleChangeproduct(e) {
        console.log(e.target.files);
        setImageProductFile(URL.createObjectURL(e.target.files[0]));
        setProductImageFileUpload(e.target.files[0]);
    } 

    const uploadAll = () => {
        let file_array = [];
        file_array.push(productImageFileUpload);
        for (let index = 0; index < file_array.length; index++) {
          let file = file_array[index];
          if (file) {
            if (file.size > 1024 * 1024) {
              enqueueSnackbar("File size cannot exceed more than 1MB", { variant: "error" })
              return;
            }
            let formData = new FormData();
            formData.append('file', file);
            http.post('/admin/products/upload', formData, {
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

    const formik = useFormik({
        initialValues: {
            product_name: product ? product.product_name : "",
            product_category: product ? product.product_category : "",
            product_stock: product ? product.product_stock : 0,
            product_description: product ? product.product_description : "",
            product_picture: product ? product.product_picture : "",
            product_picture_type: product ? product.product_picture_type : "",
            product_price: product ? product.product_price : 0,
            product_sale: product ? product.product_sale : false,
            product_discounted_percent: product ? product.product_discounted_percent : 0,
            duration_of_pass: product ? product.duration_of_pass : 0,
            product_status: product ? product.product_status : true,
        },
        validationSchema: Yup.object({
            product_name: Yup.string().trim().min(3).max(100).required("Product Name is required"),
            product_category: Yup.string().trim().required("Product Category is required"),
            product_stock: Yup.number("Invalid number").integer().required("Product Stock is required"),
            product_description: Yup.string().trim().min(3).max(1000).required("Product Description is required"),
            product_picture: Yup.string(),
            product_picture_type: Yup.string(),
            product_price: Yup.number().positive().integer().required("Product Price is required"),
            product_sale: Yup.bool(),
            product_discounted_percent: Yup.number().positive().integer().required("Discount Percentage is required"),
            duration_of_pass: Yup.number().integer(),
            product_status: Yup.bool()
        }),
        onSubmit: (data) => {
            setLoading(true);
            data.product_name = data.product_name.trim();
            data.product_category = data.product_category.trim();
            data.product_stock = data.product_stock;
            data.product_description = data.product_description.trim();
            data.product_picture = data.product_picture;
            data.product_picture_type = data.product_picture_type;
            data.product_price = data.product_price;
            data.product_sale = data.product_sale;
            data.product_discounted_percent = data.product_discounted_percent;
            data.product_status = data.product_status;

            http.put("/admin/products/" + id, data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Product updated successfully!.", { variant: "success" });
                    navigate("/admin/products")
                } else {
                    enqueueSnackbar("Product update failed!.", { variant: "error" });
                    setLoading(false);
                }
            }).catch((err) => {
                enqueueSnackbar("Product update failed! " + err.response.data.message, { variant: "error" });
                setLoading(false);
            })
        },
        enableReinitialize: true
    })

    function getProduct() {
        http.get("/admin/products/" + id).then((res) => {
            if (res.status === 200) {
                setProduct(res.data);
            } else {
                enqueueSnackbar("Product retrieval failed!.", { variant: "error" });
                setLoading(false);
                return navigate(-1);
            }
        }).catch((err) => {
            enqueueSnackbar("Product retrieval failed! " + err.response.data.message, { variant: "error" });
            setLoading(false);
            return navigate(-1);
        })
    }

    useEffect(() => {
        getProduct();
    }, [])

    return (
        <>
            <Container maxWidth="xl" sx={{ marginY: "1rem" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton size="large" onClick={() => navigate(-1)} sx={{ marginRight: "1rem" }}><ArrowBackIcon /></IconButton>
                    <Box sx={{ marginY: ["1rem", "1rem", "2rem"] }}>
                        <Typography variant="h3" fontWeight={700} sx={{ fontSize: ["2rem", "2rem", "3rem"] }}>Edit Product</Typography>
                    </Box>

                </Box>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <LoadingButton variant="contained" onClick={formik.handleSubmit} loading={loading} loadingPosition="start" startIcon={<SaveIcon />} sx={{ marginBottom: "1rem" }}>Save</LoadingButton>
                    <Stack spacing={2} direction="column" sx={{ marginBottom: "1rem" }}>
                        <Card sx={{ margin: "auto" }}>
                            <CardContent>
                                <CardTitle title="Product Information" icon={<ManageAccountsIcon color="text.secondary" />} />
                                <Grid container spacing={2} sx={{ marginY: "1rem" }}>
                                    <Grid item xs={4} sm={4} >
                                        <TextField
                                            fullWidth
                                            id="product_name"
                                            name="product_name"
                                            label="Product Name"
                                            variant="outlined"
                                            value={formik.values.product_name}
                                            onChange={formik.handleChange}
                                            error={formik.touched.product_name && Boolean(formik.errors.product_name)}
                                            helperText={formik.touched.product_name && formik.errors.product_name}
                                        />
                                    </Grid>
                                    <Grid item xs={4} sm={2} >
                                        <FormControl variant="outlined" fullWidth>
                                            <InputLabel id="product_category_label">Product Category</InputLabel>
                                            <Select
                                                id="product_category"
                                                name="product_category"
                                                labelId="product_category_label"
                                                label="Product Category"
                                                value={formik.values.product_category}
                                                onChange={formik.handleChange}
                                                error={formik.touched.product_category && Boolean(formik.errors.product_category)}
                                                helperText={formik.touched.product_category && formik.errors.product_category}
                                            >
                                                <MenuItem value="Normal Product">Normal Product</MenuItem>
                                                <MenuItem value="Pass">Pass</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4} sm={6}>
                                        <InputLabel id="product_description_label">Product Description</InputLabel>
                                        <MDEditor
                                            data-color-mode="light"
                                            preview="edit"
                                            id="product_description"
                                            name="product_description"
                                            labelId="product_description_label"
                                            label="Product Description"
                                            variant="outlined"
                                            onChange={setDescriptionValue}
                                            value={descriptionValue ? formik.values.product_description= descriptionValue : formik.values.product_description}
                                            error={formik.touched.product_description && Boolean(formik.errors.product_description)}
                                            helperText={formik.touched.product_description && formik.errors.product_description}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        {/* product_price */}
                                        <TextField
                                            fullWidth
                                            id="product_price"
                                            name="product_price"
                                            label="Product Price"
                                            variant="outlined"
                                            type="number"
                                            value={formik.values.product_price}
                                            onChange={formik.handleChange}
                                            error={formik.touched.product_price && Boolean(formik.errors.product_price)}
                                            helperText={formik.touched.product_price && formik.errors.product_price}
                                            sx={{ marginY: "-4.5rem" }}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        {/* product_discounted_percent */}
                                        <TextField
                                            fullWidth
                                            id="product_discounted_percent"
                                            name="product_discounted_percent"
                                            label="Discount Percentage"
                                            type="number"
                                            variant="outlined"
                                            value={formik.values.product_discounted_percent}
                                            onChange={formik.handleChange}
                                            error={formik.touched.product_discounted_percent && Boolean(formik.errors.product_discounted_percent)}
                                            helperText={formik.touched.product_discounted_percent && formik.errors.product_discounted_percent}
                                            sx={{ marginY: "-4.5rem" }}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        {/* product_stock */}
                                        <TextField
                                            fullWidth
                                            id="product_stock"
                                            name="product_stock"
                                            label="Product Stock"
                                            type="number"
                                            variant="outlined"
                                            value={formik.values.product_stock}
                                            onChange={formik.handleChange}
                                            error={formik.touched.product_stock && Boolean(formik.errors.product_stock)}
                                            helperText={formik.touched.product_stock && formik.errors.product_stock}
                                            sx={{ marginY: "-4.5rem" }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        {/* product_picture */}
                                        <Button variant="contained" component="label" fullWidth>
                                            Upload Product Image
                                            <input hidden accept="image/*" onChange={handleChangeproduct} multiple type="file" />
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        {/* product_price_greenmiles */}
                                        <TextField
                                            fullWidth
                                            id="product_price_greenmiles"
                                            name="product_price_greenmiles"
                                            label="GreenMiles"
                                            variant="outlined"
                                            value={formik.values.product_price / 10}
                                            error={formik.touched.product_price_greenmiles && Boolean(formik.errors.product_price_greenmiles)}
                                            helperText={formik.touched.product_price_greenmiles && formik.errors.product_price_greenmiles}
                                            sx={{ marginY: "-3.5rem" }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        {/* product_discounted_price_greenmiles */}
                                        <TextField
                                            fullWidth
                                            id="product_discounted_price_greenmiles"
                                            name="product_discounted_price_greenmiles"
                                            label="GreenMiles Discounted"
                                            variant="outlined"
                                            value={Math.floor(((1 - formik.values.product_discounted_percent / 100) * formik.values.product_price) / 10)}
                                            error={formik.touched.product_discounted_price_greenmiles && Boolean(formik.errors.product_discounted_price_greenmiles)}
                                            helperText={formik.touched.product_discounted_price_greenmiles && formik.errors.product_discounted_price_greenmiles}
                                            sx={{ marginY: "-3.5rem" }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={8}>
                                    </Grid>
                                    {
                                        formik.values.product_category === "Pass" && (
                                            <>
                                                <Grid item xs={4} sm={2} sx={{ marginY: "-1.5rem" }}>
                                                    {/* duration_of_pass */}
                                                    <FormControl variant="outlined" fullWidth>
                                                        <InputLabel id="duration_of_pass_label">Duration of Pass</InputLabel>
                                                        <Select
                                                            id="duration_of_pass"
                                                            name="duration_of_pass"
                                                            labelId="duration_of_pass_label"
                                                            label="duration_of_pass"
                                                            value={formik.values.duration_of_pass}
                                                            onChange={formik.handleChange}
                                                            error={formik.touched.duration_of_pass && Boolean(formik.errors.duration_of_pass)}
                                                            helperText={formik.touched.duration_of_pass && formik.errors.duration_of_pass}
                                                        >
                                                            <MenuItem value="7">7 Days</MenuItem>
                                                            <MenuItem value="30">1 Month</MenuItem>
                                                            <MenuItem value="60">2 Months</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </>
                                        )
                                    }
                                </Grid>
                                {/* product_sale */}
                                <FormControlLabel label="Sale?" control={
                                    <Checkbox
                                        id="product_sale"
                                        name="product_sale"
                                        label="Sale?"
                                        variant="outlined"
                                        value={formik.values.product_sale}
                                        checked={formik.values.product_sale}
                                        onChange={formik.handleChange}
                                        error={formik.touched.product_sale && Boolean(formik.errors.product_sale)}
                                        helperText={formik.touched.product_sale && formik.errors.product_sale}
                                    />
                                } />
                                {/* product_status */}
                                <FormControlLabel label="Product Status?" control={
                                    <Checkbox
                                        id="product_status"
                                        name="product_status"
                                        label="Product Status?"
                                        variant="outlined"
                                        value={formik.values.product_status}
                                        checked={formik.values.product_status}
                                        onChange={formik.handleChange}
                                        error={formik.touched.product_status && Boolean(formik.errors.product_status)}
                                        helperText={formik.touched.product_status && formik.errors.product_status}
                                    />
                                } />
                            </CardContent>
                        </Card>
                    </Stack>

                </Box>
            </Container>
            {/* <Dialog open={changePictureDialog} onClose={handleChangePictureDialogClose}>
                <DialogTitle>Change Profile Picture</DialogTitle>
                <Box component="form">
                    <DialogContent sx={{ paddingTop: 0 }}>
                        <DialogContentText>
                            You are currently using a {user ? user.profile_picture_type === "gravatar" ? "Gravatar" : "local" : "unknown"} profile picture.
                            <br /><br />
                            You can select a new profile picture from your computer or from Gravatar. To set a new profile picture from your computer, click on the "Choose File" button below. To set a new profile picture from Gravatar, click on the "Use Gravatar" button below.
                            <br /><br />
                            For information on how to set a profile picture on Gravatar, please visit <Link href="https://en.gravatar.com/support/">https://en.gravatar.com/support/</Link>.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleChangePictureDialogClose} startIcon={<CloseIcon />}>Cancel</Button>
                        <LoadingButton loadingPosition="start" loading={loadingPicture} variant="text" color="primary" startIcon={<PublicIcon />} onClick={handleGravatarChange}>Use Gravatar</LoadingButton>
                        <LoadingButton loadingPosition="start" loading={loadingPicture} variant="text" color="primary" startIcon={<FileUploadIcon />} component="label">Upload Image<input type='file' onChange={handlePictureChange} hidden /></LoadingButton>
                    </DialogActions>
                </Box>
            </Dialog> */}
        </>
    )
}

export default EditProduct