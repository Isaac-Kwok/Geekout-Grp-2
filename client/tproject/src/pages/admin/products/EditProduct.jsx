import React, { useState, useEffect } from 'react'
import { Container, Typography, Card, CardContent, Box, Tab, Tabs, Stack, Checkbox, InputAdornment, TextField, Grid, FormControlLabel, FormControl, InputLabel, Select, MenuItem, Button, Dialog, DialogContent, DialogActions, DialogContentText, DialogTitle } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import CardTitle from '../../../components/CardTitle';
import { useNavigate, useParams } from 'react-router-dom'
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import http from '../../../http'
import MDEditor from '@uiw/react-md-editor';
import AdminPageTitle from '../../../components/AdminPageTitle'
import CategoryIcon from '@mui/icons-material/Category';
import { useSnackbar } from 'notistack'
import * as Yup from "yup";
import { useFormik } from 'formik';
import ImageIcon from '@mui/icons-material/Image';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      <Box p={3}>
        <Typography>{children}</Typography>
      </Box>
    </div>
  );
}

function EditProduct() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [productFile, setProductFile] = useState();
  const [productFileUpload, setProductFileUpload] = useState();
  const [loadingPicture, setLoadingPicture] = useState(false);
  const [changePictureDialog, setChangePictureDialog] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const productPath = `${import.meta.env.VITE_API_URL}/admin/products/productImage/`

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const setProductImage = () => {
    setProductFile(product.product_picture);
  }

  const handleChangePictureDialogClose = () => {
    setChangePictureDialog(false);
  }

  const handleChangePictureDialogOpen = () => {
    setChangePictureDialog(true);
  }
  function handleChangeProductImage(e) {
    setProductFile(URL.createObjectURL(e.target.files[0]));
    setProductFileUpload(e.target.files[0]);
    console.log(productFileUpload)
    enqueueSnackbar("Successfully uploaded product picture. ", { variant: "success" })
  }

  const subCategories = {
    'Health and Beauty': ['Bath', 'Disinfectant', 'Feminine Care', 'Hair', 'Oral Care'],
    'Household': ['Bathroom', 'Bug & Insect Repellent'],
    'Take Away & Travel': ['Bag, pouch, carrier', 'Lunch Box', 'Straw', 'Toiletries'],
  };

  const handleCategoryChange = (event) => {
    formik.handleChange(event);
    formik.setFieldValue('sub_category', '');
  };

  const handlePictureChange = (e) => {
    setLoadingPicture(true);
    console.log(e);
    const formData = new FormData();

    // Loop through the files and append each to the form data
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append("product_picture", e.target.files[i]);
    }

  }

  const AspectRatioBox = ({ children }) => (
    <div style={{
      position: 'relative',
      width: '100%',
      height: 0,
      paddingBottom: '56.25%', /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625 or 56.25%) */
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }}>
        {children}
      </div>
    </div>
  );


  const formik = useFormik({
    initialValues: {
      product_name: product ? product.product_name : "",
      product_category: product ? product.product_category : "",
      product_sub_category: product ? product.product_sub_category : "",
      pass_category_status: product ? product.pass_category_status : false,
      product_stock: product ? product.product_stock : 0,
      product_description: product ? product.product_description : "",
      product_picture: product ? product.product_picture : "",
      product_price: product ? product.product_price : 0,
      product_sale: product ? product.product_sale : false,
      product_discounted_percent: product ? product.product_discounted_percent : 0,
      duration_of_pass: product ? product.duration_of_pass : 0,
      product_status: product ? product.product_status : true,
    },
    validationSchema: Yup.object({
      product_name: Yup.string().trim().min(3).max(100).required("Product Name is required"),
      product_category: Yup.string().trim().required("Product Category is required"),
      product_sub_category: Yup.string().trim().required("Sub Category is required"),
      pass_category_status: Yup.bool(),
      product_stock: Yup.number("Invalid number").integer().required("Product Stock is required"),
      product_description: Yup.string().trim().min(3).max(1000).required("Product Description is required"),
      product_picture: Yup.string(),
      product_price: Yup.number().min(0).integer().required("Product Price is required"),
      product_sale: Yup.bool(),
      product_discounted_percent: Yup.number().min(0).integer().required("Discount Percentage is required"),
      duration_of_pass: Yup.number().integer(),
      product_status: Yup.bool()
    }),
    onSubmit: (data) => {
      setLoading(true);
      data.product_name = data.product_name.trim();
      data.product_category = data.product_category.trim();
      data.product_stock = data.product_stock;
      data.product_description = data.product_description.trim();
      data.product_price = data.product_price;
      data.product_sale = data.product_sale;
      data.product_discounted_percent = data.product_discounted_percent;
      data.product_status = data.product_status;


      console.log(data)
      if (productFileUpload) {
        let formData = new FormData();
        formData.append('file', productFileUpload);
        http.post('/admin/products/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then((uploadRes) => {
            if (uploadRes.status === 200) {
              data.product_picture = uploadRes.data.filename
              console.log(uploadRes.data.filename)
              console.log(data)
              http.put("/admin/products/" + id, data).then((res) => {
                if (res.status === 200) {
                  enqueueSnackbar("Product updated successfully!", { variant: "success" });
                  navigate("/admin/products")
                } else {
                  enqueueSnackbar("Product update failed!", { variant: "error" });
                  setLoading(false);
                }
              }).catch((err) => {
                enqueueSnackbar("Product update failed! " + err.response.data.message, { variant: "error" });
                setLoading(false);
              })
            }
          })
      } else {
        http.put("/admin/products/" + id, data).then((res) => {
          if (res.status === 200) {
            enqueueSnackbar("Product updated successfully!", { variant: "success" });
            navigate("/admin/products")
          } else {
            enqueueSnackbar("Product update failed!", { variant: "error" });
            setLoading(false);
          }
        }).catch((err) => {
          enqueueSnackbar("Product update failed! " + err.response.data.message, { variant: "error" });
          setLoading(false);
        })
      }
    },
    enableReinitialize: true
  })

  function getProduct() {
    http.get("/admin/products/" + id).then((res) => {
      if (res.status === 200) {
        setProduct(res.data);
        console.log(data)
      } else {
        enqueueSnackbar("Product retrieval failed!", { variant: "error" });
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
      <Container maxWidth="xl" sx={{ marginTop: "1rem" }}>
        <AdminPageTitle title="Edit Product" subtitle={product && product.product_name} backbutton />
        <LoadingButton
          variant="contained"
          color="primary"
          type="submit"
          loading={loading}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          onClick={formik.handleSubmit}
          sx={{ marginBottom: "1rem" }}
        >
          Edit Product
        </LoadingButton>
        <Card sx={{ margin: "auto" }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example">
              <Tab icon={<CategoryIcon />} iconPosition="start" label="Product Information" />
              <Tab icon={<ImageIcon />} iconPosition="start" label="Product Image" />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Box component="form">
              <CardContent>
                <Grid container spacing={2} >
                  <Grid xs={12} lg={6} spacing={2} item container>
                    <Grid item xs={12} sm={12} >
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
                    <Grid item xs={12} sm={8}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="product_category_label">Product Category</InputLabel>
                        <Select
                          id="product_category"
                          name="product_category"
                          labelId="product_category_label"
                          label="Product Category"
                          value={formik.values.product_category}
                          onChange={handleCategoryChange}
                          error={formik.touched.product_category && Boolean(formik.errors.product_category)}
                          helperText={formik.touched.product_category && formik.errors.product_category}
                        >
                          <MenuItem value="">Select a category</MenuItem>
                          {Object.keys(subCategories).map((category) => (
                            <MenuItem key={category} value={category}>
                              {category}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="sub_category_label">Sub Category</InputLabel>
                        <Select
                          id="product_sub_category"
                          name="product_sub_category"
                          labelId="product_sub_category_label"
                          label="Sub Category"
                          value={formik.values.product_category ? formik.values.product_sub_category : ""}
                          onChange={formik.handleChange}
                          error={formik.touched.product_sub_category && Boolean(formik.errors.product_sub_category)}
                          helperText={formik.touched.product_sub_category && formik.errors.product_sub_category}
                          disabled={!formik.values.product_category}
                        >
                          <MenuItem value="">Select a sub-category</MenuItem>
                          {formik.values.product_category && subCategories[formik.values.product_category] &&
                            subCategories[formik.values.product_category].map((subCategory) => (
                              <MenuItem key={subCategory} value={subCategory}>
                                {subCategory}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
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
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
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
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
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
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      {/* product_price_greenmiles */}
                      <TextField
                        fullWidth
                        id="product_price_greenmiles"
                        name="product_price_greenmiles"
                        label="GreenMiles"
                        variant="outlined"
                        value={formik.values.product_price_greenmiles = formik.values.product_price / 10}
                        error={formik.touched.product_price_greenmiles && Boolean(formik.errors.product_price_greenmiles)}
                        helperText={formik.touched.product_price_greenmiles && formik.errors.product_price_greenmiles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      {/* product_discounted_price_greenmiles */}
                      <TextField
                        fullWidth
                        id="product_discounted_price_greenmiles"
                        name="product_discounted_price_greenmiles"
                        label="GreenMiles Discounted"
                        variant="outlined"
                        value={formik.values.product_discounted_price_greenmiles = Math.floor(((1 - formik.values.product_discounted_percent / 100) * formik.values.product_price) / 10)}
                        error={formik.touched.product_discounted_price_greenmiles && Boolean(formik.errors.product_discounted_price_greenmiles)}
                        helperText={formik.touched.product_discounted_price_greenmiles && formik.errors.product_discounted_price_greenmiles}
                      />
                    </Grid>
                    {
                      formik.values.pass_category_status && (
                        <>
                          <Grid item xs={12} sm={4}>
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
                  <Grid xs={12} lg={6} spacing={2} item container>
                    <Grid item xs={12}>
                      <Typography fontWeight={700} marginBottom={"0.25rem"}>Product Description</Typography>
                      <MDEditor
                        data-color-mode="light"
                        preview="edit"
                        id="product_description"
                        name="product_description"
                        labelId="product_description_label"
                        label="Product Description"
                        variant="outlined"
                        onChange={(value) => {
                          setDescriptionValue(value);
                          formik.setFieldValue('product_description', value);
                        }}
                        value={descriptionValue ? descriptionValue : formik.values.product_description}
                        error={formik.touched.product_description && Boolean(formik.errors.product_description)}
                        helperText={formik.touched.product_description && formik.errors.product_description}
                      />
                    </Grid>
                    <Grid item xs={12}>
                    </Grid>
                  </Grid>
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
                <FormControlLabel label="Pass Status?" control={
                  <Checkbox
                    id="pass_category_status"
                    name="pass_category_status"
                    label="Pass Status?"
                    variant="outlined"
                    value={formik.values.pass_category_status}
                    checked={formik.values.pass_category_status}
                    onChange={formik.handleChange}
                    error={formik.touched.pass_category_status && Boolean(formik.errors.pass_category_status)}
                    helperText={formik.touched.pass_category_status && formik.errors.pass_category_status}
                  />
                } />
              </CardContent>
            </Box>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <CardContent>
              <Grid container spacing={2} >
                <Grid xs={12} lg={6} spacing={1} item container>
                  <Grid item xs={12}>
                    <Typography fontWeight={700} marginBottom={"0.25rem"}>Product Images</Typography>
                    <AspectRatioBox>
                      <img src={productFile ? productFile : product ? `${productPath}${product.product_picture}` : ""} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </AspectRatioBox>
                  </Grid>
                </Grid>
                <Grid xs={12} lg={6} spacing={2} item container>
                  <Grid item xs={12} marginTop={"0.25rem"}>
                    {/* product_picture */}
                    <Button variant="contained" component="label" fullWidth>
                      Upload Product Image
                      <input hidden accept="image/*" onChange={handleChangeProductImage} multiple type="file" />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </TabPanel>
        </Card>
      </Container>
    </>
  )
}

export default EditProduct