import React, { useEffect, useState, useContext, useMemo } from 'react'
import { Box, Accordion, AccordionSummary, AccordionDetails, Paper, FormControlLabel, FormGroup, Container, Grid, Checkbox, Typography, Card, CardContent, CardMedia, CardActions, Chip, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import http from "../../http";
import { ProductContext } from './ProductRoutes'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';
import { useSnackbar } from 'notistack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/system';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PageTitle from '../../components/PageTitle';



function ProductCard({ product }) {
    const navigate = useNavigate();
    const productPath = `${import.meta.env.VITE_API_URL}/admin/products/productImage/`
    const { enqueueSnackbar } = useSnackbar();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;



    const loadWishlistItems = async () => {
        try {
            const response = await http.get('/wishlist');
            const productIds = response.data.map(item => item.Product.id);
            setWishlistItems(productIds);
        } catch (error) {
            console.error('Error loading wishlist items:', error);
        }
    };

    const handleAddToWishlist = async (productId) => {
        if (wishlistItems.includes(productId)) {
            handleRemoveFromWishlist(productId);
        } else {
            try {
                const response = await http.post('/wishlist', { productId: productId });
                if (response.status === 201) {
                    setWishlistItems(prevState => [...prevState, productId]);
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
                setWishlistItems(prevState => prevState.filter(id => id !== productId));
            }
        } catch (error) {
            console.error('Error removing product from wishlist:', error);
        }
    };



    useEffect(() => {
        loadWishlistItems();
    }, []);


    return (
        <Card sx={{ position: 'relative' }} elevation={3}>
            {product.product_sale && (
                <Chip
                    label="On Sale"
                    color="secondary"
                    sx={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        zIndex: '1',
                        backgroundColor: 'red',
                        color: 'white',
                        fontSize: '12px',
                        height: '20px',
                    }}
                />
            )}
            <CardMedia
                component="img"
                height="140"
                image={`${productPath}${product.product_picture}`}
                alt={product.product_name}
            />

            <CardContent>
                <Typography variant="h5">{product.product_name}</Typography>
                <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
                    <span style={{ textDecoration: product.product_sale ? "line-through" : "none" }}>
                        ${product.product_price ? product.product_price : "NIL"}
                    </span>
                    {product.product_sale ?
                        <span style={{ color: "red", marginLeft: "1rem" }}>
                            ${(product.product_price * (1 - product.product_discounted_percent / 100)).toFixed(2)}
                        </span>
                        : null}
                </Typography>
                <Typography variant="body1">
                    <span>Availability:&nbsp;</span>
                    <span style={{ color: product.product_status == 1 && product.product_stock ? "black" : "red" }}>
                        {product.product_status == 1 && product.product_stock ? "In Stock" : "Out of Stock"}
                    </span>
                    <br />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    GreenMiles: {product.product_price_greenmiles}<br />
                    On Sale: {product.product_sale ? "Yes" : "No"}
                </Typography>
            </CardContent>
            <CardActions>
                <Grid container alignItems="center">
                    <Grid item xs>
                        <Button variant="contained" color="primary" fullWidth onClick={() => navigate("/products/" + product.id)}>View Product</Button>
                    </Grid>
                    <Grid item>
                        <IconButton
                            onClick={() => handleAddToWishlist(product.id)}
                        >
                            {wishlistItems.includes(product.id)
                                ? <FavoriteIcon color="error" />
                                : <FavoriteBorderIcon />}
                        </IconButton>
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    )

}





const categories = {
    'Health and Beauty': ['Bath', 'Disinfectant', 'Feminine Care', 'Hair', 'Oral Care'],
    'Household': ['Bathroom', 'Bug & Insect Repellent'],
    'Take Away & Travel': ['Bag, pouch, carrier', 'Lunch Box', 'Straw', 'Toiletries'],
};

function ViewProducts() {
    const { product, setProduct } = useContext(ProductContext)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const PageButton = styled(Button)(({ theme }) => ({
        margin: theme.spacing(0, 1),
        padding: theme.spacing(1, 2),
        borderRadius: '5px',
        outline: 'none',
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
        }
    }));


    const StyledBox = styled(Box)(({ theme }) => ({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing(1),
        marginTop: theme.spacing(2),
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '5px',
        backgroundColor: theme.palette.background.default,
    }));

    const PaginationList = styled('ul')(({ theme }) => ({
        listStyle: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0,
    }));


    const handleGetProduct = () => {
        http.get('/products')
            .then((response) => {
                const productsData = response.data;
                setProducts(productsData);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    }


    useEffect(() => {
        document.title = "EnviroGo - Products"
        handleGetProduct()
    }, [])


    const [selected, setSelected] = useState({});

    const handleFilterChange = (category, subCategories = [], isChecked) => {
        // if a main category was checked/unchecked, update all its subcategories
        if (subCategories.length > 0) {
            setSelected(prevSelected => {
                const updatedSelected = { ...prevSelected, [category]: isChecked };
                subCategories.forEach(subCategory => {
                    updatedSelected[subCategory] = isChecked;
                });
                return updatedSelected;
            });
        } else {
            // if a subcategory was checked/unchecked, update the category and the subcategory itself
            setSelected(prevSelected => {
                const updatedSelected = { ...prevSelected, [category]: isChecked };
                const parentCategory = Object.entries(categories)
                    .find(([_, subCategories]) => subCategories.includes(category))[0];
                updatedSelected[parentCategory] = Object.keys(prevSelected)
                    .filter(key => categories[parentCategory].includes(key))
                    .every(key => updatedSelected[key]);
                return updatedSelected;
            });
        }
    };

    const filters = useMemo(() => Object.entries(selected)
        .filter(([_, isChecked]) => isChecked)
        .map(([key, _]) => key)
        , [selected]);

    const displayedProducts = useMemo(() => {
        return filters.length > 0 ? products.filter(product =>
            filters.includes(product.product_category) || filters.includes(product.product_sub_category)
        ) : products;
    }, [filters, products]);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    // Determine which products to show
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = useMemo(() => {
        return displayedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    }, [displayedProducts, currentPage]);

    const totalPageNumbers = useMemo(() => {
        return Math.ceil(displayedProducts.length / productsPerPage);
    }, [displayedProducts]);

    return (
        <>
            <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
                <PageTitle title="Shop" subtitle="Browse Products" />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={3} sx={{ padding: "1rem" }}>
                            <FormGroup>
                                {Object.entries(categories).map(([category, subCategories], i) => (
                                    <Accordion key={category} sx={{ marginBottom: i < Object.keys(categories).length - 1 ? "1rem" : "0" }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls={`panel${i}a-content`}
                                            id={`panel${i}a-header`}
                                        >
                                            <Typography variant="h6">
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={selected[category] || false}
                                                            onChange={(e) => handleFilterChange(category, subCategories, e.target.checked)}
                                                            name={category}
                                                        />}

                                                    label={<Typography sx={{ pointerEvents: "none" }}>{category}</Typography>}
                                                />

                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ marginTop: "-1.5rem" }}>
                                            {subCategories.map(subCategory => (
                                                <Typography variant="body1" sx={{ paddingLeft: "1rem" }}>

                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={selected[subCategory] || false}
                                                                onChange={(e) => handleFilterChange(subCategory, [], e.target.checked)}
                                                                name={subCategory}
                                                            />
                                                        }
                                                        label={<Typography sx={{ pointerEvents: "none" }}>{subCategory}</Typography>}
                                                    />

                                                </Typography>
                                            ))}
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </FormGroup>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={9}>
                        <Grid container spacing={2}>
                            {currentProducts.map((product) => ( // use currentProducts instead of displayedProducts
                                <Grid item xs={12} sm={6} md={4} key={product.id}>
                                    <ProductCard product={product} />
                                </Grid>
                            ))}
                        </Grid>
                        <StyledBox>
                            <PaginationList>
                                {/* Previous page button */}
                                <li>
                                    <PageButton
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    >
                                        <NavigateBeforeIcon />
                                    </PageButton>
                                </li>

                                {[...Array(totalPageNumbers)].map((_, index) => (
                                    <li key={index}>
                                        <PageButton
                                            variant={currentPage === index + 1 ? 'contained' : 'text'}
                                            color="primary"
                                            onClick={() => setCurrentPage(index + 1)}
                                        >
                                            {index + 1}
                                        </PageButton>
                                    </li>
                                ))}

                                {/* Next page button */}
                                <li>
                                    <PageButton
                                        disabled={currentPage === totalPageNumbers}
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPageNumbers))}
                                    >
                                        <NavigateNextIcon />
                                    </PageButton>
                                </li>
                            </PaginationList>
                        </StyledBox>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export default ViewProducts