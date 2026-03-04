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
  Paper,
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";

import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../../services/admin/productService";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [pageSize, setPageSize] = useState(10);

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
      sortable: false,
      renderCell: (params) =>
        params.value ? (
          <Box
            component="img"
            src={`${import.meta.env.VITE_ECOM_BASE_URL}/uploads/${params.value}`}
            alt="product"
            sx={{
              width: 44,
              height: 44,
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
      renderCell: (params) => <Typography fontWeight={600}>₹{params.value}</Typography>,
    },
    {
      field: "stock",
      headerName: "Stock",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: params.value > 0 ? "#ecfdf5" : "#fef2f2",
            color: params.value > 0 ? "#047857" : "#b91c1c",
            fontWeight: 600,
          }}
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
          size="small"
          sx={{
            bgcolor: params.value === "Active" ? "#ecfdf5" : "#f3f4f6",
            color: params.value === "Active" ? "#047857" : "#374151",
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => navigate(`/admin/products/edit/${params.row.id}`)}
            sx={{
              color: "#374151",
              "&:hover": { bgcolor: "#f3f4f6" },
            }}
          >
            <EditOutlinedIcon />
          </IconButton>
          <IconButton
            onClick={() => setDeleteId(params.row.id)}
            sx={{
              color: "#b91c1c",
              "&:hover": { bgcolor: "#fee2e2" },
            }}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={700}>
          Products
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/products/create")}
          sx={{
            bgcolor: "#111",
            "&:hover": { bgcolor: "#000" },
          }}
        >
          Add Product
        </Button>
      </Box>

      {/* TABLE */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <Box p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 15, 20, 50]}
            paginationModel={{ pageSize }}
            onPaginationModelChange={(model) => setPageSize(model.pageSize)}
            disableRowSelectionOnClick
            sx={{
              border: 0,
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: "#f9fafb",
                fontWeight: 600,
              },
              "& .MuiDataGrid-row:hover": {
                bgcolor: "#f9fafb",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f1f1f1",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #eee",
              },
            }}
          />
        )}
      </Paper>

      {/* DELETE CONFIRM MODAL */}
      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            px: 1,
            py: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Delete Product
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary">
            Are you sure you want to delete this product? This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          {/* Cancel Button */}
          <Button
            onClick={() => setDeleteId(null)}
            variant="outlined"
            sx={{
              borderColor: "#d1d5db",
              color: "#374151",
              "&:hover": {
                borderColor: "#000",
                color: "#000",
                backgroundColor: "#f9fafb",
              },
            }}
          >
            Cancel
          </Button>

          {/* Delete Button */}
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              bgcolor: "#111",
              color: "#fff",
              "&:hover": {
                bgcolor: "#000",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductList;