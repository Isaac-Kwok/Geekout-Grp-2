import React, { useState, useEffect } from 'react'
import { Container, Typography, Card, CardContent, CardActions, Box, Stack, Checkbox, InputAdornment, TextField, Grid, FormControlLabel, FormControl, IconButton, InputLabel, Select, MenuItem, Button, Dialog, DialogContent, DialogActions, DialogContentText, DialogTitle, Link, Input } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import CardTitle from '../../components/CardTitle';
import { useNavigate, useParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import http from '../../http'
import MDEditor from '@uiw/react-md-editor';
import AdminPageTitle from '../../components/AdminPageTitle';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CategoryIcon from '@mui/icons-material/Category';
import { useSnackbar } from 'notistack';

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

function ViewSingleProduct() {
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
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
                    <Card sx={{ margin: "auto" }}>
                        <Box component="form">
                            <CardContent>
                                <CardTitle title="Product Information" icon={<IconButton size="large" onClick={() => navigate("/products")} ><ArrowBackIcon /><CategoryIcon/></IconButton>} />
                                <Grid container spacing={1} sx={{ marginY: "1rem" }}>
                                    <img src={`${productPath}${product.product_picture}`} alt={product.product_name} style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
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
                                        <MDEditor.Markdown
                                            style={{ backgroundColor: "white", color: "black" }}
                                            source={product.product_description} />
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