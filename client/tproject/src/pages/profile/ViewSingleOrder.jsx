import React, { useState, useEffect } from 'react';
import { Button, Container, Grid, Card, CardContent, CardMedia, Typography, Paper, List, ListItem, ListItemText, Divider, Box, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CardTitle from '../../components/CardTitle'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useSnackbar } from 'notistack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import http from '../../http';
import { Category, RequestQuote } from '@mui/icons-material';
import InfoBox from '../../components/InfoBox';

const order_status = {
  1: "Preparing",
  2: "Wait for delivery",
  3: "Delivered",
  4: "Received",
  5: "Cancelled",
  6: "Refund Processing",
  7: "Refund Approved",
  8: "Refund Denied"
};

function ViewSingleOrder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const productPath = `${import.meta.env.VITE_API_URL}/admin/products/productImage/`
  const { enqueueSnackbar } = useSnackbar();
  const productPictures = order?.OrderItems?.Product?.product_picture && Array.isArray(order.OrderItems.Product.product_picture)
    ? order.OrderItems.Product.product_picture
    : JSON.parse(order?.OrderItems?.Product?.product_picture || '[]');


  const fetchOrder = async () => {
    try {
      const response = await http.get("/orders/" + id);
      console.log('Order data:', response.data);
      setOrder(response.data);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error fetching order:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', error.message);
      }
    }
  }

  const changeStatus = async () => {
    try {
      const response = await http.put(`/orders/set-received/${id}`);
      if (response.data && response.data.order) {
        setOrder(response.data.order);
        enqueueSnackbar('Order status updated to Received.', { variant: 'success' });
        fetchOrder();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        // Display specific error message from the backend
        enqueueSnackbar(error.response.data.message, { variant: 'error' });
      } else {
        enqueueSnackbar('An error occurred while updating the order status.', { variant: 'error' });
      }
    }
  }

  useEffect(() => {
    fetchOrder();
  }, []);


  if (!order || !order.OrderItems || !order.OrderItems.length) {
    return 'Loading...';
  }

  return (
    <Card>
      <CardContent>
        <CardTitle icon={<ReceiptLongIcon />} title="Order Details" back="/profile/orders" />
        <Box marginY={"1rem"}>
          <Grid container spacing={2} direction={{ xs: 'column-reverse', sm: 'row' }}>
            <Grid item xs={12} sm={8}>
              <Card variant='outlined'>
                <CardContent>
                  <CardTitle icon={<Category />} title="Status & Order Items" />
                  <Box marginTop={"1rem"}>
                    <InfoBox title="Order Status" value={order.order_status} />
                    {order.Refund && (
                      <InfoBox title="Order Status" value={order.Refund.refund_status} />
                    )}
                    <br /><Divider></Divider><br />
                    <Typography variant="h6" marginBottom={"0.5rem"}>Order Items:</Typography>
                    {order.OrderItems.map(item => {
                      const productPictures = item.Product.product_picture && Array.isArray(item.Product.product_picture)
                        ? item.Product.product_picture
                        : JSON.parse(item.Product.product_picture || '[]');

                      return (
                        <Card variant='outlined' sx={{ display: 'flex', marginBottom: 2, flexDirection: { xs: "column", md: "row" } }}>
                          <CardMedia
                            component="img"
                            sx={{ width: { xs: "100%", md: "140px" } }}  // Adjust the size as needed
                            image={`${productPath}${productPictures[0]}`} // Assuming you have product_image field in Product
                            alt={item.Product.product_name}
                          />
                          <CardContent sx={{flexGrow: 1}}>
                            <Box display="flex" alignItems="center">
                              <Box flexGrow={1}>
                                <Typography fontWeight={700} fontSize={"18px"}>
                                  {item.Product.product_name}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary">
                                  Quantity: {item.quantity}
                                </Typography>
                              </Box>
                              <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
                                <span style={{ textDecoration: item.discounted ? "line-through" : "none" }}>
                                  ${item.total_price ? item.total_price : "NIL"}
                                </span>
                                {item.discounted ?
                                  <span style={{ color: "red", marginLeft: "1rem" }}>
                                    ${(parseFloat(item.discounted_total_price) || 0).toFixed(2)}
                                  </span>
                                  : null}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Box>

                </CardContent>

              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card variant='outlined'>
                <CardContent>
                  <CardTitle icon={<RequestQuote />} title="Payment Summary" />
                </CardContent>
                <List>
                  <ListItem>
                    <ListItemText primary="Subtotal" />
                    <Typography variant="body1">${(order.total_amount / 108 * 100).toFixed(2)}</Typography>
                  </ListItem>
                  {/* The calculations for GST and total might vary based on your requirements */}
                  <ListItem>
                    <ListItemText primary="GST (8%)" />
                    <Typography variant="body1">${(order.total_amount / 108 * 8).toFixed(2)}</Typography>
                  </ListItem>
                  <Divider></Divider>
                  <ListItem>
                    <ListItemText primary="Total" />
                    <Typography variant="body1">${order.total_amount}</Typography>
                  </ListItem>
                </List>
                {order.order_status === "Preparing" || order.order_status === "Received" && (
                  <Grid container alignItems="center">
                    <Grid item xs>
                      <Button variant="contained" color="primary" fullWidth onClick={() => navigate("/profile/refunds/" + order.id)}>Refund</Button>
                    </Grid>
                  </Grid>)}
                {order.order_status === "Delivered" && (
                  <Grid container alignItems="center">
                    <Grid item xs>
                      <Button variant="contained" color="primary" fullWidth onClick={changeStatus}>Received</Button>
                    </Grid>
                  </Grid>)}
              </Card>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>

  );

}

export default ViewSingleOrder;
