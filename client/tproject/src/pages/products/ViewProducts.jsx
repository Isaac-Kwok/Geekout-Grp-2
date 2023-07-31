import React, { useEffect, useState, useContext } from 'react'
import { Box, Paper, FormControlLabel, FormGroup, Container, Grid, List, ListItem, ListItemText, Checkbox, Typography, Card, CardContent, CardMedia, CardActions, Chip, Button, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions } from '@mui/material'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import http from "../../http";
import LoadingSkeleton from '../../components/LoadingSkeleton';
import CloseIcon from '@mui/icons-material/Close';
import { ProductContext } from './ProductRoutes'

function ProductCard({ product }) {
    const navigate = useNavigate();
    const productPath = `${import.meta.env.VITE_API_URL}/admin/products/productImage/`
    return (
        <Card sx={{ maxWidth: 345, margin: 2 }} elevation={3}>
            <CardMedia
                component="img"
                height="140"
                image={`${productPath}${product.product_picture}`}
                alt={product.product_name}
            />
            <CardContent>
                <Typography variant="h5">{product.product_name}</Typography>
                <Typography variant="h6" >
                    ${product.product_price ? product.product_price : "NIL"}<br />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Availability:&nbsp;
                    {product.product_stock ? (
                        <>
                            In Stock
                        </>
                    ) : (
                        <>
                            Out of Stock
                        </>
                    )}<br />
                    GreenMiles: {product.product_price_greenmiles}<br />
                    On Sale: {product.product_sale ? "Yes" : "No"}
                </Typography>
            </CardContent>
            <CardActions>
                <Button variant="contained" color="primary" fullWidth onClick={() => navigate("/products/" + product.id)}>View Product</Button>
            </CardActions>
        </Card >
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
    const [filters, setFilters] = useState([]);

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


    const handleFilterChange = (event) => {
        if (event.target.checked) {
            setFilters([...filters, event.target.name]);
        } else {
            setFilters(filters.filter(filter => filter !== event.target.name));
        }
    }
    const displayedProducts = filters.length > 0 ? products.filter(product =>
        filters.includes(product.product_category) || filters.includes(product.product_sub_category)
    ) : products;
    return (
        <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
            <Typography variant="h3" fontWeight={700} sx={{ marginY: ["1rem", "1rem", "2rem"], fontSize: ["2rem", "2rem", "3rem"] }}>View Product</Typography>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <Paper elevation={3} sx={{ padding: "1rem" }}>
                        <FormGroup>
                            {Object.entries(categories).map(([category, subCategories], i) => (
                                <Box key={category} sx={{ marginBottom: i < Object.keys(categories).length - 1 ? "2rem" : "0" }}>
                                    <Typography variant="h6">
                                        <FormControlLabel
                                            control={<Checkbox onChange={handleFilterChange} name={category} />}
                                            label={category}
                                        />
                                    </Typography>
                                    {subCategories.map(subCategory => (
                                        <Typography variant="body1">
                                            <FormControlLabel
                                                control={<Checkbox onChange={handleFilterChange} name={subCategory} />}
                                                label={subCategory}
                                                key={subCategory}
                                            />
                                        </Typography>
                                    ))}
                                </Box>
                            ))}
                        </FormGroup>
                    </Paper>
                </Grid>
                <Grid item xs={9}>
                    <Grid container spacing={2}>
                        {displayedProducts.map((product) => (
                            <Grid item xs={4} key={product.id}>
                                <ProductCard product={product} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
}

export default ViewProducts