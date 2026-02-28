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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

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
    } catch (err) {
      console.error("Failed to fetch categories", err);
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

    if (!form.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (form.name.length < 2) {
      newErrors.name = "Minimum 2 characters required";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    }

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
      setForm({ name: "", description: "" });
      fetchCategories();
    } catch (err) {
      console.error("Save failed", err);
      alert(err?.response?.data?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async () => {
    try {
      await deleteCategory(editingCategory.id);
      setOpenDelete(false);
      fetchCategories();
    } catch {
      alert("Failed to delete category");
    }
  };

  /* ================= COLUMNS ================= */

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
          color={params.value === "Active" ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleOpenEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => {
              setEditingCategory(params.row);
              setOpenDelete(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Categories</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Add Category
        </Button>
      </Box>

      {/* TABLE */}
      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ height: 520 }}>
          <DataGrid rows={rows} columns={columns} disableRowSelectionOnClick />
        </Box>
      )}

      {/* CREATE / UPDATE MODAL */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth>
        <DialogTitle>
          {editingCategory ? "Update Category" : "Add Category"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Category Name"
              fullWidth
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

        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : editingCategory ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this category?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryList;