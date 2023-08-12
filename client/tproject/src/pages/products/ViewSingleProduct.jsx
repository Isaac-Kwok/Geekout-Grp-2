import React, { useState, useEffect } from 'react'
import { Paper, Container, Typography, Card, CardContent, CardActions, Box, Stack, Checkbox, InputAdornment, TextField, Grid, FormControlLabel, FormControl, IconButton, InputLabel, Select, MenuItem, Button, Dialog, DialogContent, DialogActions, DialogContentText, DialogTitle, Link, Input } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
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
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Carousel from 'react-material-ui-carousel';
import { useTheme } from '@mui/material/styles';



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
    const [quantity, setQuantity] = useState(1);
    const [activeStep, setActiveStep] = useState(0);
    const theme = useTheme();
    const maxSteps = product && Array.isArray(product.product_picture) ? product.product_picture.length : 0;
    const shouldDisplayNavButtons = product && product.product_picture.length > 1;


    const handleNext = () => {
        setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, maxSteps - 1));
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
    };


    function increaseQuantity() {
        setQuantity(prevQuantity => prevQuantity + 1);
    }

    function decreaseQuantity() {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    }
    const [inWishlist, setInWishlist] = useState(false);


    const loadWishlistItems = async (product) => {
        try {
            const response = await http.get('/wishlist/' + product.id);
            const isInWishlist = response.status === 200;
            setInWishlist(isInWishlist);
        } catch (error) {
            console.error('Error loading wishlist item:', error);
        }
    };

    const handleAddToWishlist = async () => {
        if (!product) return;
        if (inWishlist) {
            handleRemoveFromWishlist(product.id);
        } else {
            try {
                const response = await http.post('/wishlist', { productId: product.id });
                if (response.status === 201) {
                    setInWishlist(true);
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    enqueueSnackbar('Error adding product to wishlist: Product might already be in your wishlist or does not exist', { variant: 'error' });
                } else {
                    console.error('Error adding product to wishlist:', error);
                }
            }
        }
    };


    const handleRemoveFromWishlist = async (productId) => {
        try {
            const response = await http.delete(`/wishlist/${productId}`);
            if (response.status === 200) {
                setInWishlist(false);
            }
        } catch (error) {
            console.error('Error removing product from wishlist:', error);
        }
    };

    const addToCart = () => {
        http.post('/cart', {
            productId: product.id,
            quantity: quantity
        })
            .then(response => {
                if (response.status === 201) {
                    enqueueSnackbar(
                        <span>
                            Product added to cart.{' '}
                            <span
                                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                onClick={() => navigate('/cart')}
                            >
                                Go to Cart
                            </span>
                        </span>,
                        { variant: 'success' }
                    );
                } else {
                    enqueueSnackbar('Error adding product to cart', { variant: 'error' });
                }
            })
            .catch(err => {
                console.error('Error adding product to cart:', err);
                enqueueSnackbar('Error adding product to cart', { variant: 'error' });
            });
    }

    async function getProduct() {
        try {
            const res = await http.get("/products/" + id);
            if (res.status === 200) {
                setProduct(res.data);
                console.log("Product data:", res.data);
                loadWishlistItems(res.data);  // Pass the product object directly here
            } else {
                enqueueSnackbar("Product retrieval failed!.", { variant: "error" });
                console.log("Product retrieval failed with status:", res.status);
                setLoading(false);
                return navigate(-1);
            }
        } catch (err) {
            enqueueSnackbar("Product retrieval failed! " + err.response.data.message, { variant: "error" });
            console.log("Product retrieval failed with error:", err);
            setLoading(false);
            return navigate(-1);
        }
    }

    useEffect(() => {
        document.title = "EnviroGo - Products"
        getProduct();
    }, []);


    return (
        <>
            {product && (
                <Container maxWidth="xl" sx={{ marginTop: "1rem" }}>
                    <Card sx={{ margin: "auto" }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={3}>
                                {/* Navigation Button */}
                                <Box>
                                    <IconButton size="large" onClick={() => navigate("/products")}>
                                        <ArrowBackIcon />
                                    </IconButton>
                                </Box>
                                {/* Title on the Left */}
                                <Box textAlign="left" ml={3}>
                                    <Typography variant="h3" fontWeight="700" >{product.product_name}</Typography>
                                    <Typography variant="subtitle1" color="textSecondary" >Category: {product.product_category}</Typography>
                                </Box>
                            </Box>
                            <Grid container spacing={3}>
                                {/* Product Picture */}
                                <Grid item xs={12} md={9} container alignItems="flex-end" style={{ height: '100%' }}>
                                    <Box position="relative" width="100%">
                                        <Carousel
                                            autoPlay={false}
                                            indicators={false}
                                            navButtonsAlwaysVisible={shouldDisplayNavButtons}
                                            cycleNavigation={shouldDisplayNavButtons}
                                            animation='slide'
                                            navButtonsProps={{
                                                style: {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.5) !important', // Translucent white with !important
                                                    color: 'black !important',
                                                    margin: '0 10px !important' // Optional: Added for spacing with !important
                                                }
                                            }}
                                            navButtonsWrapperProps={{
                                                style: {
                                                    bottom: '0 !important',
                                                    top: 'unset !important',
                                                    position: 'absolute !important',  
                                                    width: '100% !important'
                                                }
                                            }}
                                        >
                                            {
                                                product.product_picture.map((picture, index) =>
                                                    <Paper elevation={0} key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                        <AspectRatioBox>
                                                            <img
                                                                src={`${productPath}${picture.trim()}`}
                                                                alt={product.product_name}
                                                                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                                                            />
                                                        </AspectRatioBox>
                                                    </Paper>
                                                )
                                            }
                                        </Carousel>
                                    </Box>
                                </Grid>

                                {/* Product Details */}
                                <Grid item xs={12} md={3} container alignItems="flex-end">
                                    <Card variant="outlined" elevation={3} sx={{ width: '100%', boxShadow: 2 }}>
                                        <CardContent>
                                            <Typography variant="h5" fontWeight="bold" component="span">
                                                Price:
                                            </Typography>
                                            <Typography variant="h5" fontWeight="bold" component="span" sx={{ textDecoration: product.product_sale ? "line-through" : "none" }}>
                                                ${product.product_price ? product.product_price : "NIL"}
                                            </Typography>
                                            {product.product_sale && (
                                                <Typography variant="h5" fontWeight="bold" component="span" sx={{ color: "red", marginLeft: "0.5rem" }}>
                                                    ${((product.product_price * (1 - product.product_discounted_percent / 100)).toFixed(2))}
                                                </Typography>
                                            )}
                                            <Typography variant="body1">
                                                <span>Availability:&nbsp;</span>
                                                <span style={{ color: product.product_status == 1 && product.product_stock ? "black" : "red" }}>
                                                    {product.product_status == 1 && product.product_stock ? "In Stock" : "Out of Stock"}
                                                </span>
                                            </Typography>
                                            <Box>
                                                {product.product_status == 1 && product.product_stock && (
                                                    <>
                                                        <Grid container spacing={2} alignItems="center">
                                                            <Grid item>
                                                                <IconButton onClick={decreaseQuantity} disabled={quantity === 1}>
                                                                    <RemoveIcon />
                                                                </IconButton>
                                                            </Grid>
                                                            <Grid item>
                                                                <Typography>{quantity}</Typography>
                                                            </Grid>
                                                            <Grid item>
                                                                <IconButton onClick={increaseQuantity}>
                                                                    <AddIcon />
                                                                </IconButton>
                                                            </Grid>
                                                        </Grid>
                                                        <Button onClick={addToCart} variant="contained" color="primary" sx={{ width: 'calc(100% - 50px)', marginRight: '10px' }}>
                                                            Add to Cart
                                                        </Button>
                                                    </>)}
                                                <IconButton onClick={() => handleAddToWishlist(product.id)}>
                                                    {inWishlist ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                                                </IconButton>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>


                                {/* Product Description */}
                                <Grid item xs={12}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>Description</Typography>
                                    <MDEditor.Markdown
                                        style={{ backgroundColor: "white", color: "black", fontFamily: "Poppins" }}
                                        source={product.product_description} />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Container>
            )}
        </>

    )
}

export default ViewSingleProduct