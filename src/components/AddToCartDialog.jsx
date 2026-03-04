import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  CircularProgress,
} from "@mui/material";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../services/user/cartService";
import toast from "react-hot-toast";

const AddToCartDialog = ({ open, onClose, product }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_ECOM_BASE_URL;
  const token = localStorage.getItem("token");

  const maxStock = product?.countInStock || 0;

  useEffect(() => {
    if (product) setQuantity(1);
  }, [product]);

  const handleAdd = async () => {
    if (quantity > maxStock) {
      toast.error(`Only ${maxStock} item${maxStock > 1 ? "s" : ""} available`);
      return;
    }

    try {
      setLoading(true);

      await addToCart(product._id, quantity);

      setLoading(false);
      onClose();

      toast.success("Product added to cart successfully");
    } catch (err) {
      console.error(err);
      setLoading(false);

      const errorMessage =
        err?.response?.data?.message || "Something went wrong";

      toast.error(errorMessage);
    }
  };

  const handleQtyChange = (value) => {
    let qty = Number(value);

    if (qty > maxStock) {
      toast.error(`Only ${maxStock} item${maxStock > 1 ? "s" : ""} available`);
      qty = maxStock;
    }

    setQuantity(Math.max(1, qty));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: "#fff",
          p: 1,
        },
      }}
    >
      {!token ? (
        <>
          <DialogTitle sx={{ fontWeight: 700 }}>
            Login Required
          </DialogTitle>

          <DialogContent>
            <Typography color="text.secondary">
              You must login to add products to your cart.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={onClose}
              sx={{
                color: "#111",
                textTransform: "none",
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{
                bgcolor: "#111",
                textTransform: "none",
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "#000",
                },
              }}
            >
              Login
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogTitle sx={{ fontWeight: 700 }}>
            Add to Cart
          </DialogTitle>

          <DialogContent sx={{ py: 3 }}>
            {product && (
              <Box display="flex" gap={3} alignItems="center">
                <img
                  src={
                    product.images?.[0]
                      ? `${BASE_URL}/uploads/${product.images[0]}`
                      : "https://via.placeholder.com/120"
                  }
                  alt={product.name}
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "contain",
                    background: "#f5f5f5",
                    borderRadius: 12,
                    padding: 10,
                  }}
                />

                <Box flex={1}>
                  <Typography fontWeight={600}>
                    {product.name}
                  </Typography>

                  <Typography fontWeight={700} mt={1}>
                    ₹{product.price}
                  </Typography>

                  {/* STOCK INFO */}
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    Available Stock: {maxStock}
                  </Typography>

                  {maxStock === 1 && (
                    <Typography color="warning.main" fontSize={13}>
                      Only 1 item left in stock
                    </Typography>
                  )}

                  {maxStock > 1 && maxStock <= 5 && (
                    <Typography color="warning.main" fontSize={13}>
                      Hurry! Only {maxStock} left
                    </Typography>
                  )}

                  {/* QUANTITY INPUT */}
                  <TextField
                    type="number"
                    label="Quantity"
                    size="small"
                    fullWidth
                    value={quantity}
                    inputProps={{
                      min: 1,
                      max: maxStock,
                    }}
                    onChange={(e) => handleQtyChange(e.target.value)}
                    sx={{
                      mt: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#111",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#111",
                      },
                    }}
                  />
                </Box>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={onClose}
              sx={{
                color: "#111",
                textTransform: "none",
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleAdd}
              disabled={loading || maxStock === 0}
              sx={{
                bgcolor: "#111",
                textTransform: "none",
                borderRadius: 2,
                minWidth: 140,
                "&:hover": {
                  bgcolor: "#000",
                },
              }}
            >
              {maxStock === 0 ? (
                "Out of Stock"
              ) : loading ? (
                <CircularProgress size={22} sx={{ color: "#fff" }} />
              ) : (
                "Add to Cart"
              )}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default AddToCartDialog;