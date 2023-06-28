import React, { useState } from 'react'
import { Container, Typography, Card, CardContent, CardActions, Box, Stack, Checkbox, InputAdornment, TextField, Grid, FormControlLabel, FormControl, IconButton, InputLabel, Select, MenuItem, Button } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import CardTitle from "../../../components/CardTitle";
import http from '../../../http';
import MDEditor from '@uiw/react-md-editor';
import { useSnackbar } from 'notistack';
import { Form, useNavigate } from 'react-router-dom';
import * as Yup from "yup";;
import { useFormik } from 'formik';

function CreateProduct() {

  const [loading, setLoading] = useState(false);
  const [productImageFileUpload, setProductImageFileUpload] = useState();
  const [descriptionValue, setDescriptionValue] = useState();
  const [productImageFile, setImageProductFile] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

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
      product_name: "",
      product_category: "",
      product_stock: 0,
      product_description: "",
      product_picture: "",
      product_picture_type: "",
      product_price: 0,
      product_sale: false,
      product_discounted_percent: 0,
      duration_of_pass: 0,
      product_status: true,
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

      console.log(data)
      uploadAll()
      http.post("/admin/products/create", data)
        .then((res) => {
          if (res.status == 200) {
            enqueueSnackbar('Product successfully created', { variant: 'success' });
            navigate('/admin/products')
          }
        }).catch((e) => {
          enqueueSnackbar("Error creating product. " + e.response.data.message, { variant: "error" })
        });

    }
  })

  return (
    <>
      <Container maxWidth="xl" sx={{ marginTop: "1rem" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton size="large" onClick={() => navigate("/admin/products")} sx={{ marginRight: "1rem" }}><ArrowBackIcon /></IconButton>
          <Typography variant="h3" fontWeight={700} sx={{ marginY: ["1rem", "1rem", "2rem"], fontSize: ["2rem", "2rem", "3rem"] }}>Create Product</Typography>
        </Box>
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
          Create Product
        </LoadingButton>
        <Card sx={{ margin: "auto" }}>
          <Box component="form">
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
                    value={formik.values.product_description=descriptionValue}
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
                  checked ={formik.values.product_sale}
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
          </Box>
        </Card>
      </Container>
    </>
  )
}



export default CreateProduct