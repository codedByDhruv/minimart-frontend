import {
  Box,
  Typography,
  Grid,
  Pagination,
  CircularProgress,
  IconButton,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProducts } from "../../services/user/productService";

import ProductCard from "../../components/ProductCard";
import AddToCartDialog from "../../components/AddToCartDialog";

const Products = () => {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // ================= FETCH PRODUCTS =================

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        setLoading(true);

        const res = await getProducts(page, limit);

        const data = res.data;

        setProducts(data.products);
        setTotalPages(data.totalPages);
        setTotalProducts(data.totalProducts);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

  }, [page]);

  // ================= ADD TO CART =================

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  // ================= VIEW PRODUCT =================

  const handleView = (id) => {
    navigate(`/products/${id}`);
  };

  return (

    <Box sx={{ py: 10, px: 2 }}>

      <Box maxWidth={1300} mx="auto">

        {/* HEADER */}

        <Typography
          variant="h4"
          fontWeight={800}
          textAlign="center"
          mb={1}
        >
          All Products
        </Typography>

        <Typography
          textAlign="center"
          color="text.secondary"
          mb={6}
        >
          {totalProducts} Products Available
        </Typography>

        {/* LOADING */}

        {loading ? (

          <Box textAlign="center" py={10}>
            <CircularProgress sx={{ color: "#111" }} />
          </Box>

        ) : (

          <>

            {/* PRODUCTS GRID */}

            <Grid container spacing={4} justifyContent="center">

              {products.map((product) => (

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={product._id}
                >
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                </Grid>

              ))}

            </Grid>

            {/* PAGINATION */}

            <Box
              display="flex"
              justifyContent="center"
              mt={8}
            >

              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#111",
                  },
                  "& .Mui-selected": {
                    bgcolor: "#111 !important",
                    color: "#fff",
                  },
                }}
              />

            </Box>

          </>

        )}

      </Box>

      {/* ADD TO CART DIALOG */}

      <AddToCartDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        product={selectedProduct}
      />

    </Box>
  );
};

export default Products;