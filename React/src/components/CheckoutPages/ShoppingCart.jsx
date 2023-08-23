import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import ShoppingContext from "../../context/ShoppingContext";
import DeleteIcon from "@mui/icons-material/Delete";

const ShoppingCart = () => {
  const shoppingCtx = useContext(ShoppingContext);
  const { cartItems, cartId, getItems } = shoppingCtx;
  const cartArray = cartItems.items;
  const [quantities, setQuantities] = useState({});
  const [isCheckout, setIsCheckout] = useState(false);

  const handleChange = (productId, event) => {
    const updatedQuantities = {
      ...quantities,
      [productId]: event.target.value,
    };
    setQuantities(updatedQuantities);
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/api2/cart/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
          cartId: cartId,
        }),
      });

      if (res.ok) {
        getItems(cartId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (productId) => {
    removeFromCart(productId);
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/api2/cart", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
          cartId: cartId,
          quantity: quantity,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        getItems(cartId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateQuantity = (productId, quantity) => {
    updateQuantity(productId, quantity);
  };

  const handleCheckout = () => {
    setIsCheckout(true);
    // Add logic here to handle the checkout process
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>

      {isCheckout ? (
        <Paper elevation={3} style={{ padding: "20px" }}>
          {/* Checkout Form */}
          <Typography variant="h5" gutterBottom>
            Checkout
          </Typography>
          {/* Add your checkout form fields here */}
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Shipping Address"
            variant="outlined"
            fullWidth
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Payment Method"
            variant="outlined"
            fullWidth
            style={{ marginBottom: "10px" }}
          />
          <Button variant="contained" color="primary" onClick={handleCheckout}>
            Place Order
          </Button>
        </Paper>
      ) : (
        <>
          {cartArray.map((item) => (
            <Paper
              elevation={3}
              style={{ padding: "20px", marginBottom: "20px" }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <img
                    src={item.product.image[0]}
                    alt={item.product.name}
                    style={{ width: "80px", marginBottom: "10px" }}
                  />
                </Grid>
                <Grid item xs>
                  <Typography variant="h6">{item.product.name}</Typography>
                  <Typography variant="body1">
                    Price: ${item.product.price} x Quantity: {item.quantity}
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    <TextField
                      label="Quantity"
                      type="number"
                      variant="outlined"
                      fullWidth
                      inputProps={{ min: "0" }}
                      value={quantities[item.product._id] || item.quantity}
                      onChange={(event) =>
                        handleChange(item.product._id, event)
                      }
                      style={{ marginRight: "10px" }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handleUpdateQuantity(
                          item.product._id,
                          quantities[item.product._id] || item.quantity
                        )
                      }
                    >
                      Update Quantity
                    </Button>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(item.product._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </>
      )}

      {cartArray.length > 0 && (
        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Total Order Cost: ${cartItems.totalAmount.toFixed(2)}
        </Typography>
      )}

      <Button
        variant="contained"
        component={Link}
        to="/"
        style={{ marginTop: "20px", marginRight: "10px" }}
      >
        Continue Shopping
      </Button>
      {!isCheckout && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckout}
          style={{ marginTop: "20px" }}
        >
          Checkout
        </Button>
      )}
    </Container>
  );
};

export default ShoppingCart;
