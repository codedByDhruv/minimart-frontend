import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  IconButton,
  Chip,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../../services/admin/productService";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await getProducts();

      const mapped = res.products.map((p) => ({
        id: p._id,
        name: p.name,
        image: p.images?.[0] || null,
        category: p.category?.name || "-",
        price: p.price,
        stock: p.countInStock,
        status: p.isActive ? "Active" : "Inactive",
      }));

      setRows(mapped);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(deleteId);
      setDeleteId(null);
      fetchProducts();
    } catch {
      alert("Failed to delete product");
    }
  };

  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 90,
      renderCell: (params) =>
        params.value ? (
          <Box
            component="img"
            src={`${import.meta.env.VITE_ECOM_BASE_URL}/uploads/${params.value}`}
            alt="product"
            sx={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: 2,
              border: "1px solid #eee",
            }}
          />
        ) : (
          "—"
        ),
    },
    { field: "name", headerName: "Product Name", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    {
      field: "price",
      headerName: "Price (₹)",
      flex: 1,
    },
    {
      field: "stock",
      headerName: "Stock",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value > 0 ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Active" ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => navigate(`/admin/products/edit/${params.row.id}`)}
          >
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => setDeleteId(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Products</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/products/create")}
        >
          Add Product
        </Button>
      </Box>

      {/* TABLE */}
      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ height: 520 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            disableRowSelectionOnClick
          />
        </Box>
      )}

      {/* DELETE CONFIRM MODAL */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductList;