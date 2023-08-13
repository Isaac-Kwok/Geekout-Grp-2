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
        <CardTitle icon={<ReceiptLongIcon />} title="Order Details" />
        <Box marginY={"1rem"}>
          <Grid container spacing={2} direction={{ xs: 'column-reverse', sm: 'row' }}>
            <Grid item xs={12} sm={9}>
              <Paper elevation={2} sx={{ padding: 2 }}>
                <Typography variant="h6">Status & Delivery Information</Typography>
                <Typography variant="body1">Status of Order: {order.order_status}</Typography>
                {order.Refund && (
                  <Typography variant="body1">Refund Status: {order.Refund.refund_status}</Typography>
                )}
                <br /><Divider></Divider><br />
                <Typography variant="h6">Order Items:</Typography>
                {order.OrderItems.map(item => {
                  const productPictures = item.Product.product_picture && Array.isArray(item.Product.product_picture)
                    ? item.Product.product_picture
                    : JSON.parse(item.Product.product_picture || '[]');

                  return (
                    <Card elevation={2} sx={{ display: 'flex', marginBottom: 2, border: '1px solid #ccc' }}>
                      <CardMedia
                        component="img"
                        sx={{ width: 140 }}  // Adjust the size as needed
                        image={`${productPath}${productPictures[0]}`} // Assuming you have product_image field in Product
                        alt={item.Product.product_name}
                      />
                      <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="h5" variant="h5">
                          {item.Product.product_name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          Quantity: {item.quantity}
                        </Typography>
                      </CardContent>
                      <div sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', m: 2 }}>
                        <Typography variant="h6" sx={{ display: "flex", alignItems: "center", padding: '8px' }}>
                          <span style={{ textDecoration: item.discounted ? "line-through" : "none" }}>
                            ${item.total_price ? item.total_price : "NIL"}
                          </span>
                          {item.discounted ?
                            <span style={{ color: "red", marginLeft: "1rem" }}>
                              ${(parseFloat(item.discounted_total_price) || 0).toFixed(2)}
                            </span>
                            : null}
                        </Typography>
                      </div>
                    </Card>
                    );
                  })}
              </Paper>
            </Grid>

            <Grid item xs={12} sm={3}>
              <Paper elevation={2} sx={{ padding: 2 }}>
                <Typography variant="h6">Payment Summary</Typography>
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
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>

  );

}

export default ViewSingleOrder;
