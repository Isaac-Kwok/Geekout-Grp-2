import React, { useEffect, useState } from 'react'
import { Container, Typography, Button, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, Grid, Avatar, Card, CardContent, Stack, Tabs, Tab } from '@mui/material'
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
import AdminPageTitle from '../../../components/AdminPageTitle';
import CategoryIcon from '@mui/icons-material/Category';
import SellIcon from '@mui/icons-material/Sell';
import ClearIcon from '@mui/icons-material/Clear';
import AddTaskIcon from '@mui/icons-material/AddTask';
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";


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
    const [totalProducts, setTotalProducts] = useState(0);
    const [onSaleProducts, setOnSaleProducts] = useState(0);
    const [outOfStockProducts, setOutOfStockProducts] = useState(0);
    const [activeProducts, setActiveProducts] = useState(0);
    const [tabValue, setTabValue] = useState("all");


    const [sortModel, setSortModel] = useState([
        {
            field: "id",
            sort: "desc",
        },
    ]);


    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 90,
            sortable: true,
        },
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
        { field: 'product_status', headerName: 'Active?', type: 'boolean', minWidth: 100 },
        {
            field: 'actions', type: 'actions', width: 80, getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit Product"
                    onClick={() => {
                        navigate("/admin/products/" + params.row.id)
                    }}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={params.row.product_status ? <DeleteIcon /> : <AddIcon />}
                    label={params.row.product_status ? "De-activate Product" : "Activate Product"}
                    onClick={() => {
                        if (params.row.product_status) {
                            setDeactivateProduct(params.row)
                            handleDeactivateProductDialogOpen()
                        } else if (!params.row.product_status && params.row.product_stock > 0) {
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
        http.put("/admin/products/status/" + deactivateProduct.id, { product_status: false }).then((res) => {
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
        http.put("/admin/products/status/" + activateProduct.id, { product_status: true }).then((res) => {
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
                setTotalProducts(productsData.length);
                setOnSaleProducts(productsData.filter(p => p.product_sale).length);
                setOutOfStockProducts(productsData.filter(p => p.product_stock === 0).length);
                setActiveProducts(productsData.filter(p => p.product_status == true).length);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    }

    const filteredProducts = () => {
        switch (tabValue) {
            case 'all':
                return products;
            case 'onSale':
                return products.filter(p => p.product_sale === true);
            case 'active':
                return products.filter(p => p.product_status === true);
            case 'deactivated':
                return products.filter(p => !p.product_status);
            case 'outOfStock':
                return products.filter(p => p.product_stock <= 0);
            default:
                return products;
        }
    };


    useEffect(() => {
        document.title = 'EnviroGo - View Products';
        handleGetProduct()
    }, [])


    return (
        <>
            <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
                <AdminPageTitle title="View Products" />
                <Grid container spacing={2} sx={{ marginBottom: "1.5em" }}>
                    <Grid item xs={12} xl={3} md={6} sm={6}>
                        <Card>
                            <CardContent>
                                <Stack
                                    alignItems="flex-start"
                                    direction="row"
                                    justifyContent="space-between"
                                    spacing={3}
                                >
                                    <Stack spacing={1}>
                                        <Typography
                                            color="text.secondary"
                                            variant="h6"
                                        >
                                            Total Products
                                        </Typography>
                                        <Typography variant="h4">
                                            {totalProducts}

                                        </Typography>
                                    </Stack>
                                    <Avatar
                                        sx={{
                                            backgroundColor: 'secondary.main',
                                            height: 56,
                                            width: 56
                                        }}
                                    >
                                        <CategoryIcon />
                                    </Avatar>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} xl={3} md={6} sm={6}>
                        <Card>
                            <CardContent>
                                <Stack
                                    alignItems="flex-start"
                                    direction="row"
                                    justifyContent="space-between"
                                    spacing={3}
                                >
                                    <Stack spacing={1}>
                                        <Typography
                                            color="text.secondary"
                                            variant="h6"
                                        >
                                            On Sale Products
                                        </Typography>
                                        <Typography variant="h4">
                                            {onSaleProducts}
                                        </Typography>
                                    </Stack>
                                    <Avatar
                                        sx={{
                                            backgroundColor: '#ffc107',
                                            height: 56,
                                            width: 56
                                        }}
                                    >
                                        <SellIcon />
                                    </Avatar>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} xl={3} md={6} sm={6}>
                        <Card>
                            <CardContent>
                                <Stack
                                    alignItems="flex-start"
                                    direction="row"
                                    justifyContent="space-between"
                                    spacing={3}
                                >
                                    <Stack spacing={1}>
                                        <Typography
                                            color="text.secondary"
                                            variant="h6"
                                        >
                                            Out of Stock Products
                                        </Typography>
                                        <Typography variant="h4">
                                            {outOfStockProducts}
                                        </Typography>
                                    </Stack>
                                    <Avatar
                                        sx={{
                                            backgroundColor: 'error.main',
                                            height: 56,
                                            width: 56
                                        }}
                                    >
                                        <ClearIcon />
                                    </Avatar>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} xl={3} md={6} sm={6}>
                        <Card>
                            <CardContent>
                                <Stack
                                    alignItems="flex-start"
                                    direction="row"
                                    justifyContent="space-between"
                                    spacing={3}
                                >
                                    <Stack spacing={1}>
                                        <Typography
                                            color="text.secondary"
                                            variant="h6"
                                        >
                                            Active Products
                                        </Typography>
                                        <Typography variant="h4">
                                            {activeProducts}
                                        </Typography>
                                    </Stack>
                                    <Avatar
                                        sx={{
                                            backgroundColor: 'success.main',
                                            height: 56,
                                            width: 56
                                        }}
                                    >
                                        <AddTaskIcon />
                                    </Avatar>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Button LinkComponent={Link} variant="contained" color="primary" sx={{ marginBottom: "1rem" }} startIcon={<AddIcon />} to="/admin/products/create">Create Product</Button>
                <TabContext value={tabValue}>
                    <Tabs
                        value={tabValue}
                        onChange={(e, newVal) => setTabValue(newVal)}
                        variant="scrollable"
                        allowScrollButtonsMobile
                        aria-label="Products tabs"
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label="All" value="all" />
                        <Tab label="On Sale" value="onSale" />
                        <Tab label="Active" value="active" />
                        <Tab label="Deactivated" value="deactivated" />
                        <Tab label="Out of Stock" value="outOfStock" />
                    </Tabs>

                    {['all', 'onSale', 'active', 'deactivated', 'outOfStock'].map(tab => (
                        <TabPanel key={tab} value={tab}>
                            <DataGrid
                                rows={filteredProducts(tab)}
                                columns={columns}
                                pageSize={10}
                                slots={{ LoadingOverlay: LoadingSkeleton }}
                                sortModel={sortModel}
                                onSortModelChange={(model) => setSortModel(model)}
                                loading={loading}
                                autoHeight
                                getRowId={(row) => row.id}
                            />
                        </TabPanel>
                    ))}
                </TabContext>

            </Container>
            <Dialog open={deactivateProductDialog} onClose={handleDeactivateProductDialogClose}>
                <DialogTitle>Deactivate Product</DialogTitle>
                <DialogContent sx={{ paddingTop: 0 }}>
                    <DialogContentText>
                        Are you sure you want to deactivate this product?
                        <br />
                        Product Details:
                        <ul>
                            <li><b>Name:</b> {deactivateProduct?.product_name}</li>
                            <li><b>Product Stock:</b> {deactivateProduct?.product_stock}</li>
                        </ul>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeactivateProductDialogClose} startIcon={<CloseIcon />}>Cancel</Button>
                    <LoadingButton type="submit" loadingPosition="start" loading={deactivateLoading} variant="text" color="error" startIcon={<DeleteIcon />} onClick={handleDeactivateProduct}>Deactivate</LoadingButton>
                </DialogActions>
            </Dialog>
            <Dialog open={activateProductDialog} onClose={handleActivateProductDialogClose}>
                <DialogTitle>Activate Product</DialogTitle>
                <DialogContent sx={{ paddingTop: 0 }}>
                    <DialogContentText>
                        Are you sure you want to activate this product?
                        <br />
                        Product Details:
                        <ul>
                            <li><b>Name:</b> {activateProduct?.product_name}</li>
                            <li><b>Product Stock:</b> {activateProduct?.product_stock}</li>
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