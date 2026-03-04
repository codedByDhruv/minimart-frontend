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
  TextField,
  Stack,
  Paper,
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";

import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/admin/categoryService";

const CategoryList = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [form, setForm] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  /* ================= FETCH ================= */
  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      const mapped = res.categories.map((c) => ({
        id: c._id,
        name: c.name,
        description: c.description,
        status: c.isActive ? "Active" : "Inactive",
      }));
      setRows(mapped);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Category name is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= FORM HANDLING ================= */

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setForm({ name: "", description: "" });
    setErrors({});
    setOpenForm(true);
  };

  const handleOpenEdit = (row) => {
    setEditingCategory(row);
    setForm({ name: row.name, description: row.description });
    setErrors({});
    setOpenForm(true);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setSaving(true);
      if (editingCategory) {
        await updateCategory(editingCategory.id, form);
      } else {
        await createCategory(form);
      }
      setOpenForm(false);
      fetchCategories();
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async () => {
    await deleteCategory(editingCategory.id);
    setOpenDelete(false);
    fetchCategories();
  };

  /* ================= TABLE COLUMNS ================= */

  const columns = [
    { field: "name", headerName: "Category Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
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
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleOpenEdit(params.row)}
            sx={{ color: "#374151", "&:hover": { bgcolor: "#f3f4f6" } }}
          >
            <EditOutlinedIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setEditingCategory(params.row);
              setOpenDelete(true);
            }}
            sx={{ color: "#b91c1c", "&:hover": { bgcolor: "#fee2e2" } }}
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
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={700}>
          Categories
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ bgcolor: "#111", "&:hover": { bgcolor: "#000" } }}
        >
          Add Category
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
            }}
          />
        )}
      </Paper>

      {/* ================= CREATE / UPDATE MODAL ================= */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingCategory ? "Update Category" : "Add Category"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Category Name"
              fullWidth
              size="small"
              value={form.name}
              error={!!errors.name}
              helperText={errors.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setErrors({ ...errors, name: "" });
              }}
            />

            <TextField
              label="Description"
              fullWidth
              size="small"
              multiline
              rows={3}
              value={form.description}
              error={!!errors.description}
              helperText={errors.description}
              onChange={(e) => {
                setForm({ ...form, description: e.target.value });
                setErrors({ ...errors, description: "" });
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenForm(false)}
            variant="outlined"
            sx={{
              borderColor: "#d1d5db",
              color: "#374151",
              "&:hover": { borderColor: "#000", color: "#000" },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saving}
            sx={{ bgcolor: "#111", "&:hover": { bgcolor: "#000" } }}
          >
            {saving ? "Saving..." : editingCategory ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= DELETE MODAL ================= */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Delete Category
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary">
            Are you sure you want to delete this category? This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenDelete(false)}
            variant="outlined"
            sx={{
              borderColor: "#d1d5db",
              color: "#374151",
              "&:hover": { borderColor: "#000", color: "#000" },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{ bgcolor: "#111", "&:hover": { bgcolor: "#000" } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryList;