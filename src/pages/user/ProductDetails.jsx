import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Chip,
  Stack,
} from "@mui/material";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getProductById } from "../../services/user/productService";
import AddToCartDialog from "../../components/AddToCartDialog";

const ProductDetails = () => {

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const BASE_URL = import.meta.env.VITE_ECOM_BASE_URL;

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const data = await getProductById(id);
        console.log("Fetched product:", data);
        setProduct(data);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }

    };

    fetchProduct();

  }, [id]);

  const handleAddToCart = () => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <CircularProgress sx={{ color: "#111" }} />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box textAlign="center" py={10}>
        <Typography>Product not found</Typography>
      </Box>
    );
  }

  const isOutOfStock = product.countInStock === 0;

  const discountedPrice =
    product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product.price;

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, px: 2 }}>

      <Box maxWidth={1200} mx="auto">

        <Grid container spacing={6}>

          {/* PRODUCT IMAGES */}

          <Grid item xs={12} md={6}>

            {/* MAIN IMAGE */}

            <Box
              sx={{
                border: "1px solid #eee",
                borderRadius: 4,
                p: { xs: 2, md: 4 },
                textAlign: "center",
                bgcolor: "#fff"
              }}
            >

              <img
                src={`${BASE_URL}/uploads/${product?.images[selectedImage]}`}
                alt={product.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: 420,
                  objectFit: "contain"
                }}
              />

            </Box>

            {/* THUMBNAIL GALLERY */}

            <Stack
              direction="row"
              spacing={2}
              mt={3}
              flexWrap="wrap"
            >

              {product.images.map((img, index) => (

                <Box
                  key={index}
                  component="img"
                  src={`${BASE_URL}/uploads/${img}`}
                  onClick={() => setSelectedImage(index)}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 2,
                    border:
                      selectedImage === index
                        ? "2px solid #111"
                        : "1px solid #eee",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                />

              ))}

            </Stack>

          </Grid>

          {/* PRODUCT INFO */}

          <Grid item xs={12} md={6}>

            <Typography
              variant="h4"
              fontWeight={800}
              mb={2}
            >
              {product.name}
            </Typography>

            <Typography
              color="text.secondary"
              mb={3}
            >
              {product.category?.name}
            </Typography>

            {/* PRICE SECTION */}

            <Box display="flex" alignItems="center" gap={2} mb={2}>

              <Typography
                fontWeight={800}
                fontSize={30}
              >
                ₹{discountedPrice.toFixed(2)}
              </Typography>

              {product.discount > 0 && (
                <>
                  <Typography
                    sx={{
                      textDecoration: "line-through",
                      color: "gray"
                    }}
                  >
                    ₹{product.price}
                  </Typography>

                  <Chip
                    label={`${product.discount}% OFF`}
                    sx={{
                      bgcolor: "#111",
                      color: "#fff",
                      fontWeight: 600
                    }}
                  />
                </>
              )}

            </Box>

            {/* DESCRIPTION */}

            <Typography mb={4}>
              {product.description}
            </Typography>

            {/* PRODUCT META */}

            <Stack spacing={1} mb={4}>

              <Typography>
                <strong>Brand:</strong> {product.brand || "N/A"}
              </Typography>

              <Typography>
                <strong>Category:</strong> {product.category?.name}
              </Typography>

              <Typography>
                <strong>Stock:</strong>{" "}
                {isOutOfStock
                  ? "Out of Stock"
                  : `${product.countInStock} Available`}
              </Typography>

            </Stack>

            {/* ADD TO CART */}

            <Button
              variant="contained"
              startIcon={<ShoppingCartOutlinedIcon />}
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              sx={{
                bgcolor: isOutOfStock ? "#ccc" : "#111",
                px: 6,
                py: 1.6,
                borderRadius: 3,
                fontSize: 16,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: isOutOfStock ? "#ccc" : "#000",
                }
              }}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>

          </Grid>

        </Grid>

      </Box>

      <AddToCartDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        product={selectedProduct}
      />

    </Box>
  );
};

export default ProductDetails;