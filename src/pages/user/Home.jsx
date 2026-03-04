import {
  Box,
  Typography,
  Button,
  Grid,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../services/admin/productService";

import CategorySection from "../../components/CategorySection";
import FeaturesSection from "../../components/FeaturesSection";
import HeroSection from "../../components/HeroSection";
import PromoSection from "../../components/PromoSection";
import ProductCard from "../../components/ProductCard";
import AddToCartDialog from "../../components/AddToCartDialog";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();

        const activeProducts = res.products
          .filter((p) => p.isActive)
          .slice(0, 3);

        setProducts(activeProducts);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  return (
    <Box>
      <HeroSection />
      <FeaturesSection />
      <CategorySection />
      <PromoSection />

      {/* FEATURED PRODUCTS */}
      <Box sx={{ py: 12, px: 2, bgcolor: "#fafafa" }}>
        <Typography
          variant="h4"
          fontWeight={800}
          textAlign="center"
          mb={6}
        >
          Featured Products
        </Typography>

        <Grid container spacing={5} maxWidth={1100} mx="auto">
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
              />
            </Grid>
          ))}
        </Grid>

        <Box textAlign="center" mt={8}>
          <Button
            variant="outlined"
            startIcon={<VisibilityOutlinedIcon />}
            onClick={() => navigate("/products")}
            sx={{
              borderColor: "#111",
              color: "#111",
              px: 4,
              py: 1.4,
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "10px",
              transition: "all 0.25s ease",
              "&:hover": {
                bgcolor: "#111",
                color: "#fff",
                borderColor: "#111",
              },
            }}
          >
            Explore More Products
          </Button>
        </Box>
      </Box>

      <AddToCartDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        product={selectedProduct}
      />
    </Box>
  );
};

export default Home;