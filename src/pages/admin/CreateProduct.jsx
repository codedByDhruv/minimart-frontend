import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  MenuItem,
  IconButton,
  Alert,
  Paper,
  Grid,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

import { createProduct } from "../../services/admin/productService";
import { getCategories } from "../../services/admin/categoryService";

const MAX_IMAGES = 5;

const CreateProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    countInStock: "",
    category: "",
    description: "",
    isFeatured: false,
    isActive: true,
  });

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data.categories);
    };
    fetchCategories();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.price || form.price <= 0) newErrors.price = "Valid price required";
    if (!form.countInStock) newErrors.countInStock = "Stock is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (images.length === 0) newErrors.images = "At least 1 image required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > MAX_IMAGES) {
      alert("Maximum 5 images allowed");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    images.forEach((img) => formData.append("images", img));

    try {
      setLoading(true);
      await createProduct(formData);
      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      name: "",
      price: "",
      countInStock: "",
      category: "",
      description: "",
      isFeatured: false,
      isActive: true,
    });
    setImages([]);
    setErrors({});
  };

  return (
    <Box display="flex" justifyContent="center" p={3} bgcolor="#f6f7f9" minHeight="100vh">
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 900,
          p: 4,
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          bgcolor: "#fff",
        }}
      >
        <Typography variant="h5" mb={3} fontWeight={700}>
          Add Product
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {/* ================= BASIC INFO ================= */}
          <Typography fontWeight={600} mb={1}>
            Basic Information
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Product Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Price"
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                fullWidth
                error={!!errors.price}
                helperText={errors.price}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Stock"
                name="countInStock"
                type="number"
                value={form.countInStock}
                onChange={handleChange}
                fullWidth
                error={!!errors.countInStock}
                helperText={errors.countInStock}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                fullWidth
                error={!!errors.category}
                helperText={errors.category}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={12}>
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
          </Grid>

          {/* ================= IMAGE UPLOADER ================= */}
          <Typography mt={4} fontWeight={600}>
            Product Images
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload up to 5 images
          </Typography>

          {errors.images && <Alert severity="error">{errors.images}</Alert>}

          <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
            {images.map((file, index) => (
              <Box key={index} position="relative">
                <Box
                  component="img"
                  src={URL.createObjectURL(file)}
                  sx={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 2,
                    border: "1px solid #e5e7eb",
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => removeImage(index)}
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    bgcolor: "#fff",
                    border: "1px solid #eee",
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}

            {images.length < MAX_IMAGES && (
              <Button
                component="label"
                sx={{
                  width: 100,
                  height: 100,
                  border: "2px dashed #d1d5db",
                  borderRadius: 2,
                  color: "#6b7280",
                  "&:hover": { borderColor: "#000", color: "#000" },
                }}
              >
                <AddIcon />
                <input hidden multiple type="file" onChange={handleImageChange} />
              </Button>
            )}
          </Box>

          {/* ================= FLAGS ================= */}
          <Box mt={4}>
            <Typography fontWeight={600}>Options</Typography>
            <FormControlLabel
              control={<Checkbox checked={form.isFeatured} onChange={handleChange} name="isFeatured" />}
              label="Featured Product"
            />
            <FormControlLabel
              control={<Checkbox checked={form.isActive} onChange={handleChange} name="isActive" />}
              label="Active"
            />
          </Box>

          {/* ================= ACTIONS ================= */}
          <Box mt={4} display="flex" gap={2}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: "#111",
                px: 4,
                py: 1.2,
                fontWeight: 600,
                "&:hover": { bgcolor: "#000" },
              }}
            >
              {loading ? "Saving..." : "Create Product"}
            </Button>

            <Button
              type="button"
              variant="outlined"
              onClick={handleReset}
              sx={{
                px: 4,
                py: 1.2,
                borderColor: "#d1d5db",
                color: "#374151",
                "&:hover": { borderColor: "#000", color: "#000" },
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateProduct;