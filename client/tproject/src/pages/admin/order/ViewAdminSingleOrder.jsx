import React, { useState, useEffect } from 'react';
import { Button, Container, Grid, Card, CardContent, CardMedia, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

import { useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import http from '../../../http';

function ViewAdminSingleOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const productPath = `${import.meta.env.VITE_API_URL}/admin/products/productImage/`



  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await http.get("/admin/orders/" + id);
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
    fetchOrder();
  }, []);


  if (!order) {
    return 'Loading...';
  }

  return (
    <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
      <Typography variant="h3" fontWeight={700} sx={{ marginY: ["1rem", "1rem", "2rem"], fontSize: ["2rem", "2rem", "3rem"] }}>Order Details</Typography>
      <Button LinkComponent={Link} variant="contained" color="primary" sx={{ marginBottom: "1rem" }} startIcon={<ArrowBackIcon />} to="/admin/orders">Back</Button>
      <Grid container spacing={2} direction={{ xs: 'column-reverse', sm: 'row' }}>
        <Grid item xs={12} sm={9}>
          <Paper elevation={2} sx={{ padding: 2 }}>
            <Typography variant="h6">Customer & Delivery Information</Typography>
            <Typography variant="body1">Customer Email: {order.User.email}</Typography>
            <Typography variant="body1">Status of Order: {order.order_status}</Typography>
            <br /><Divider></Divider><br />
            <Typography variant="h6">Order Items:</Typography>
            {order.OrderItems.map(item => {
              const productPictures = item.Product.product_picture && Array.isArray(item.Product.product_picture)
              ? item.Product.product_picture
              : JSON.parse(item.Product.product_picture || '[]');
              return(
              <Card elevation={2} sx={{ display: 'flex', marginBottom: 2, border: '1px solid #ccc' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 140 }}  // Adjust the size as needed
                  image={`${productPath}${productPictures[0]}`}// Assuming you have product_image field in Product

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
            }
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Paper elevation={2} sx={{ padding: 2 }}>
            <Typography variant="h6">Payment Summary</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Subtotal" />
                <Typography variant="body1">${order.subtotal_amount}</Typography>
              </ListItem>
              {/* The calculations for GST and total might vary based on your requirements */}
              <ListItem>
                <ListItemText primary="GST (8%)" />
                <Typography variant="body1">${order.gst_amount}</Typography>
              </ListItem>
              <Divider></Divider>
              <ListItem>
                <ListItemText primary="Total" />
                <Typography variant="body1">${order.total_amount}</Typography>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );

}

export default ViewAdminSingleOrder;
