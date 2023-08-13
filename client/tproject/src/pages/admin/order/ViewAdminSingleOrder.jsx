import React, { useState, useEffect } from 'react';
import { Button, Container, Grid, Card, CardContent, CardMedia, Typography, Paper, List, ListItem, ListItemText, Divider, Box, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import CardTitle from '../../../components/CardTitle';
import InfoBox from '../../../components/InfoBox';
import { Category, RequestQuote } from '@mui/icons-material';

import { useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import http from '../../../http';
import AdminPageTitle from '../../../components/AdminPageTitle';

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
      <AdminPageTitle title="Order Details" subtitle={"Order ID: " + id} backbutton />
      <Grid container spacing={2} direction={{ xs: 'column-reverse', sm: 'row' }}>
        <Grid item xs={12} sm={8}>
          <Card variant='outlined'>
            <CardContent>
              <CardTitle icon={<Category />} title="Status & Order Items" />
              <Box marginTop={"1rem"}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
                  <InfoBox title="Customer Email" value={order.User.email} />
                  <InfoBox title="Order Status" value={order.order_status} />
                  {order.Refund && (
                    <InfoBox title="Order Status" value={order.Refund.refund_status} />
                  )}
                </Stack>
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
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box display="flex" alignItems="center">
                          <Box flexGrow={1}>
                            <Typography fontWeight={700} fontSize={"18px"}>
                              {item.Product.product_name}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                              Quantity: {item.quantity}
                            </Typography>
                          </Box>
                          { order.order_payment_method === "Points" ? (
                                
                                <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
                                  <span style={{ textDecoration: item.discounted ? "line-through" : "none" }}>
                                    {item.points ? item.points : "NIL"}
                                  </span>
                                  {item.discounted ?
                                    <span style={{ color: "red", marginLeft: "1rem" }}>
                                      {(parseFloat(item.points_discounted) || 0)} 
                                    </span>
                                    : null}
                                </Typography> ) : (
  
                                <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
                                  <span style={{ textDecoration: item.discounted ? "line-through" : "none" }}>
                                    ${item.total_price ? item.total_price : "NIL"}
                                  </span>
                                  {item.discounted ?
                                    <span style={{ color: "red", marginLeft: "1rem" }}>
                                      ${(parseFloat(item.discounted_total_price) || 0).toFixed(2)}
                                    </span>
                                    : null}
                                </Typography>)}
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
              {order.order_payment_method === "Points" ? (
                <>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Total Points Used" />
                    <Typography variant="body1">{order.points_used}</Typography>
                  </ListItem>
                </>
              ) : (
                <>
                  <ListItem>
                    <ListItemText primary="Subtotal" />
                    <Typography variant="body1">${order.subtotal_amount}</Typography>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="GST (8%)" />
                    <Typography variant="body1">${order.gst_amount}</Typography>
                  </ListItem>
                  <Divider></Divider>
                  <ListItem>
                    <ListItemText primary="Total" />
                    <Typography variant="body1">${order.total_amount}</Typography>
                  </ListItem>
                </>
              )}
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
    </Container>
  );

}

export default ViewAdminSingleOrder;
