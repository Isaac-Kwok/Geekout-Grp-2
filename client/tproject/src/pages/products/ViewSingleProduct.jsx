import React, { useState, useEffect } from 'react'
import { Container, Typography, Card, CardContent, CardActions, Box, Stack, Checkbox, InputAdornment, TextField, Grid, FormControlLabel, FormControl, IconButton, InputLabel, Select, MenuItem, Button, Dialog, DialogContent, DialogActions, DialogContentText, DialogTitle, Link, Input } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import CardTitle from '../../components/CardTitle';
import { useNavigate, useParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import http from '../../http'
import MDEditor from '@uiw/react-md-editor';
import AdminPageTitle from '../../components/AdminPageTitle';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CategoryIcon from '@mui/icons-material/Category';
import { useSnackbar } from 'notistack'
import LoadingSkeleton from '../../components/LoadingSkeleton';
import * as Yup from "yup";
import { useFormik } from 'formik';
import md5 from "md5";

function ViewSingleProduct() {
    const navigate = useNavigate();
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


    function getProduct() {
        http.get("/products/" + id)
            .then((res) => {
                if (res.status === 200) {
                    setProduct(res.data);
                    console.log("Product data:", res.data);
                } else {
                    enqueueSnackbar("Product retrieval failed!.", { variant: "error" });
                    console.log("Product retrieval failed with status:", res.status);
                    setLoading(false);
                    return navigate(-1);
                }
            })
            .catch((err) => {
                enqueueSnackbar("Product retrieval failed! " + err.response.data.message, { variant: "error" });
                console.log("Product retrieval failed with error:", err);
                setLoading(false);
                return navigate(-1);
            })
    }


    useEffect(() => {
        document.title = "EnviroGo - Products"
        getProduct();
    }, [])

    return (
        <>{product && (
            <>
                <Container maxWidth="xl" sx={{ marginTop: "1rem" }}>
                    <AdminPageTitle title={product.product_name} backbutton />
                    <Card sx={{ margin: "auto" }}>
                        <Box component="form">
                            <CardContent>
                                <CardTitle title="Product Information" icon={<CategoryIcon />} />
                                <Grid container spacing={1} sx={{ marginY: "1rem" }}>
                                    <img src={`${productPath}${product.product_picture}`} alt={product.product_name} style={{ width: '100%', height: 'auto' }} />
                                </Grid>
                                <Grid container spacing={2} sx={{ marginY: "1rem" }}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h6">Product Name: {product.product_name}</Typography>
                                        <Typography variant="body1">Category: {product.product_category}</Typography>
                                        <Typography variant="body1">Stock: {product.product_stock}</Typography>
                                        <Typography variant="body1">Price: {product.product_price}</Typography>
                                        {product.product_sale && (
                                            <Typography variant="body1">Sale: {product.product_sale}</Typography>,
                                            <Typography variant="body1">Discounted Price: {(1 - product.product_discounted_percent / 100) * product.product_price}</Typography>

                                        )}
                                        {product.product_category === "Pass" && (
                                            <Typography variant="body1">Duration of Pass: {product.duration_of_pass}</Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body1">Description: </Typography>
                                        <MDEditor.Markdown sx={{
                                            color: 'text.primary',
                                            backgroundColor: 'background.paper',
                                        }} source={product.product_description} />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Box>
                    </Card>
                </Container>
            </>
        )}

        </>
    )
}

export default ViewSingleProduct