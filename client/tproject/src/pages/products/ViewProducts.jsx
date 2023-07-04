import React, { useEffect, useState, useContext } from 'react'
import { Container, Typography, Chip, Button, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions} from '@mui/material'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import http from "../../http";
import LoadingSkeleton from '../../components/LoadingSkeleton';
import CloseIcon from '@mui/icons-material/Close';
import { ProductContext } from './ProductRoutes'

function ViewProducts() {
    const { product, setProduct } = useContext(ProductContext)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()



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

    const columns = [
        { field: 'product_name', headerName: 'Product Name', flex: 1, minWidth: 250 },
        { field: 'product_category', headerName: 'Category', minWidth: 200 },
        { field: 'product_stock', headerName: 'Stock', width: 200 },
        {
            field: 'product_price', headerName: 'Normal Price', minWidth: 200, renderCell: (params) => {
                return params.value ? params.value : "NIL"
            }
        },
        { field: 'product_price_greenmiles', headerName: 'GreenMiles', minWidth: 100 },
        { field: 'product_sale', headerName: 'On Sale?', type: 'boolean', minWidth: 100 },
        {
            field: 'actions', type: 'actions', width: 80, getActions: (params) => [
                <GridActionsCellItem
                    label="View Product"
                    onClick={() => {
                        navigate("/products/" + params.row.id)
                    }}
                    showInMenu
                />,
            ]
        },
    ];

    return (
        <>
            <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
                <Typography variant="h3" fontWeight={700} sx={{ marginY: ["1rem", "1rem", "2rem"], fontSize: ["2rem", "2rem", "3rem"] }}>View Product</Typography>
                <DataGrid
                    rows={products}
                    columns={columns}
                    pageSize={10}
                    slots={{
                        LoadingOverlay: LoadingSkeleton
                    }}
                    loading={loading}
                    autoHeight
                    getRowId={(row) => row.id}
                />
            </Container>
        </>
    )
}

export default ViewProducts