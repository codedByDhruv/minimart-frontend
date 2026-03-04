import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, onAddToCart }) => {
  const BASE_URL = import.meta.env.VITE_ECOM_BASE_URL;
  const navigate = useNavigate();

  const isOutOfStock = product.countInStock === 0;

  const getStockMessage = () => {
    if (product.countInStock === 1) {
      return "Only 1 left in stock";
    }
    if (product.countInStock > 1 && product.countInStock <= 5) {
      return `Only ${product.countInStock} left`;
    }
    return "";
  };

  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        borderRadius: 5,
        overflow: "hidden",
        bgcolor: "#fff",
        boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-10px)",
          boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* IMAGE */}
      <Box
        sx={{
          height: 260,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#fff",
          p: 3,
          position: "relative",
        }}
      >
        {isOutOfStock && (
          <Box
            sx={{
              position: "absolute",
              top: 15,
              left: 15,
              bgcolor: "#ff4d4f",
              color: "#fff",
              px: 2,
              py: 0.5,
              borderRadius: 2,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Out of Stock
          </Box>
        )}

        <img
          src={
            product.images?.[0]
              ? `${BASE_URL}/uploads/${product.images[0]}`
              : "https://via.placeholder.com/300"
          }
          alt={product.name}
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
          }}
        />
      </Box>

      {/* CONTENT */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography fontWeight={600} fontSize={18}>
          {product.name}
        </Typography>

        <Typography fontWeight={700} fontSize={20} mt={1}>
          ₹{product.price}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {product.category?.name || "General"}
        </Typography>

        {/* STOCK MESSAGE */}
        <Box
          sx={{
            minHeight: 24,
            mt: 1,
          }}
        >
          {getStockMessage() && (
            <Typography color="warning.main" fontSize={13}>
              {getStockMessage()}
            </Typography>
          )}
        </Box>

        {/* BUTTON */}
        <Box mt="auto">
          <Button
            fullWidth
            variant="contained"
            startIcon={<ShoppingCartOutlinedIcon />}
            disabled={isOutOfStock}
            sx={{
              mt: 2,
              py: 1.4,
              borderRadius: 3,
              bgcolor: isOutOfStock ? "#ccc" : "#111",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                bgcolor: isOutOfStock ? "#ccc" : "#000",
              },
            }}
            onClick={(e) => {
              e.stopPropagation(); // prevent redirect
              onAddToCart(product);
            }}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;