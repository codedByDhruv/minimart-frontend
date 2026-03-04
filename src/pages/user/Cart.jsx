import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import { useEffect, useState } from "react";
import {
  getCart,
  updateCart,
  deleteCartItem,
} from "../../services/user/cartService";
import OrderDialog from "../../components/OrderDialog";
import toast from "react-hot-toast";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderOpen, setOrderOpen] = useState(false);

  const BASE_URL = import.meta.env.VITE_ECOM_BASE_URL;

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCart(data);
    } catch (err) {
      toast.error("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 🧮 Grand Total
  const grandTotal =
    cart?.items?.reduce(
      (acc, item) =>
        acc + item.product.price * item.quantity,
      0
    ) || 0;

  // ➕ Increase Qty
  const increaseQty = async (item) => {
    if (item.quantity >= item.product.countInStock) {
      toast.error("Stock limit reached");
      return;
    }

    await updateCart(item.product._id, item.quantity + 1);
    fetchCart();
  };

  // ➖ Decrease Qty
  const decreaseQty = async (item) => {
    if (item.quantity <= 1) return;

    await updateCart(item.product._id, item.quantity - 1);
    fetchCart();
  };

  // ❌ Delete Item
  const handleDelete = async (productId) => {
    await deleteCartItem(productId);
    toast.success("Item removed");
    fetchCart();
  };

  return (
    <>
    <Box sx={{ py: 10, px: 2 }}>
      <Box maxWidth={1200} mx="auto">
        <Typography
          variant="h4"
          fontWeight={800}
          textAlign="center"
          mb={6}
        >
          Your Cart
        </Typography>

        {loading ? (
          <Box textAlign="center" py={10}>
            <CircularProgress />
          </Box>
        ) : cart?.items?.length === 0 ? (
          <Typography textAlign="center">
            Your cart is empty.
          </Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="center">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Subtotal</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {cart.items.map((item) => (
                    <TableRow key={item.product._id}>
                      <TableCell>
                        <Box display="flex" gap={2} alignItems="center">
                          <img
                            src={
                              item.product.images?.[0]
                                ? `${BASE_URL}/uploads/${item.product.images[0]}`
                                : "https://via.placeholder.com/80"
                            }
                            style={{
                              width: 70,
                              height: 70,
                              objectFit: "contain",
                            }}
                          />

                          <Typography fontWeight={600}>
                            {item.product.name}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell align="center">
                        ₹{item.product.price}
                      </TableCell>

                      {/* Quantity Controls */}
                      <TableCell align="center">
                        <Box display="flex" gap={1} justifyContent="center">
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => decreaseQty(item)}
                          >
                            -
                          </Button>

                          <Typography>{item.quantity}</Typography>

                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => increaseQty(item)}
                            disabled={
                              item.quantity >=
                              item.product.countInStock
                            }
                          >
                            +
                          </Button>
                        </Box>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Stock: {item.product.countInStock}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        ₹{item.product.price * item.quantity}
                      </TableCell>

                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleDelete(item.product._id)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Total */}
            <Box
              display="flex"
              justifyContent="space-between"
              mt={5}
            >
              <Typography variant="h6" fontWeight={700}>
                Grand Total: ₹{grandTotal}
              </Typography>

              <Button
                variant="contained"
                sx={{ bgcolor: "#111" }}
                onClick={() => setOrderOpen(true)}
              >
                Place Order
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
    
    <OrderDialog
      open={orderOpen}
      onClose={() => setOrderOpen(false)}
      cart={cart}
      total={grandTotal}
      refreshCart={fetchCart}
    />
    </>
  );
};

export default Cart;