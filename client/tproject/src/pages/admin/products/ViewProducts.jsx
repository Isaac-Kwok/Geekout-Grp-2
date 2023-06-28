import React, { useEffect, useState } from 'react'
import { Container, Typography, Chip, Button, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions} from '@mui/material'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import http from "../../../http";
import LoadingSkeleton from '../../../components/LoadingSkeleton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

function ViewProducts() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [deactivateLoading, setDeactivateLoading] = useState(null)
    const [deactivateProductDialog, setDeactivateProductDialog] = useState(false)
    const [deactivateProduct, setDeactivateProduct] = useState(null)
    const [activateLoading, setActivateLoading] = useState(null)
    const [activateProductDialog, setActivateProductDialog] = useState(false)
    const [activateProduct, setActivateProduct] = useState(null)
    const navigate = useNavigate()

    const columns = [
        { field: 'product_name', headerName: 'Product Name', flex: 1, minWidth: 250 },
        { field: 'product_category', headerName: 'Category', minWidth: 200 },
        { field: 'product_stock', headerName: 'Stock', width: 200 },
        {
            field: 'product_price', headerName: 'Normal Price', minWidth: 200, renderCell: (params) => {
                return params.value ? params.value : "NIL"
            }
        },
        { field: 'product_price_greenmiles', headerName: 'GreenMiles', minWidth: 200 },
        { field: 'product_sale', headerName: 'On Sale?', type: 'boolean', minWidth: 100 },
        { field: 'product_status', headerName: 'Active?', type: 'boolean', minWidth: 100 },
        {
            field: 'actions', type: 'actions', width: 80, getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit User"
                    onClick={() => {
                        navigate("/admin/products/" + params.row.id)
                    }}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={params.row.product_status ? <DeleteIcon />: <AddIcon />}
                    label={params.row.product_status ? "De-activate Product": "Activate Product"}
                    onClick={() => {
                        if (params.row.product_status) {
                            setDeactivateProduct(params.row)
                            handleDeactivateProductDialogOpen()
                        } else {
                            setActivateProduct(params.row)
                            handleActivateProductDialogOpen()
                        }
                    }}
                    showInMenu
                />
            ]
        },
    ];

    const handleDeactivateProductDialogClose = () => {
        setDeactivateProductDialog(false)
    }

    const handleDeactivateProductDialogOpen = () => {
        setDeactivateProductDialog(true)
    }

    const handleDeactivateProduct = () => {
        setDeactivateLoading(true)
        http.put("/admin/products/" + deactivateProduct.id, {product_status: false} ).then((res) => {
            if (res.status === 200) {
                setDeactivateLoading(false)
                setDeactivateProductDialog(false)
                handleGetProduct()
            }
        })
    }

    const handleActivateProductDialogClose = () => {
        setActivateProductDialog(false)
    }

    const handleActivateProductDialogOpen = () => {
        setActivateProductDialog(true)
    }

    const handleActivateProduct = () => {
        setActivateLoading(true)
        http.put("/admin/products/" + activateProduct.id, {product_status: true} ).then((res) => {
            if (res.status === 200) {
                setActivateLoading(false)
                setActivateProductDialog(false)
                handleGetProduct()
            }
        })
    }

    const handleGetProduct = () => {
        http.get('/admin/products')
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
        document.title = 'EnviroGo - View Products';
        handleGetProduct()
    }, [])


    return (
        <>
            <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
                <Typography variant="h3" fontWeight={700} sx={{ marginY: ["1rem", "1rem", "2rem"], fontSize: ["2rem", "2rem", "3rem"] }}>View Product</Typography>
                <Button LinkComponent={Link} variant="contained" color="primary" sx={{ marginBottom: "1rem" }} startIcon={<AddIcon />} to="/admin/products/create">Create Product</Button>
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
            <Dialog open={deactivateProductDialog} onClose={handleDeactivateProductDialogClose}>
                <DialogTitle>Deactivate Product</DialogTitle>
                <DialogContent sx={{ paddingTop: 0 }}>
                    <DialogContentText>
                        Are you sure you want to deactivate this product?
                        <br />
                        Product Details:
                        <ul>
                            <li>Name: {deactivateProduct?.product_name}</li>
                            <li>Product Stock: {deactivateProduct?.product_stock}</li>
                        </ul>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeactivateProductDialogClose} startIcon={<CloseIcon />}>Cancel</Button>
                    <LoadingButton type="submit" loadingPosition="start" loading={deactivateLoading} variant="text" color="error" startIcon={<DeleteIcon />} onClick={handleDeactivateProduct}>Deactivate</LoadingButton>
                </DialogActions>
            </Dialog>
            <Dialog open={activateProductDialog} onClose={handleActivateProductDialogClose}>
                <DialogTitle>activate Product</DialogTitle>
                <DialogContent sx={{ paddingTop: 0 }}>
                    <DialogContentText>
                        Are you sure you want to activate this product?
                        <br />
                        Product Details:
                        <ul>
                            <li>Name: {activateProduct?.product_name}</li>
                            <li>Product Stock: {activateProduct?.product_stock}</li>
                        </ul>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleActivateProductDialogClose} startIcon={<CloseIcon />}>Cancel</Button>
                    <LoadingButton type="submit" loadingPosition="start" loading={activateLoading} variant="text" color="error" startIcon={<AddIcon />} onClick={handleActivateProduct}>Activate</LoadingButton>
                </DialogActions>
            </Dialog>
        </>

    )
}

export default ViewProducts