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

  // 🔹 Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data.categories);
    };
    fetchCategories();
  }, []);

  // 🔹 Validation
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.price || form.price <= 0) newErrors.price = "Valid price required";
    if (!form.countInStock) newErrors.countInStock = "Stock is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (images.length === 0) newErrors.images = "At least 1 image required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // ➕ Add images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > MAX_IMAGES) {
      alert("Maximum 5 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...files]);
  };

  // ❌ Remove image
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
    } catch (err) {
      console.error("Create failed", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Reset form
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
    <Box display="flex" justifyContent="center" p={3}>
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 900,
          p: 4,
          borderRadius: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" mb={3} fontWeight={600}>
          Add Product
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
                <TextField
                label="Product Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                error={!!errors.name}
                helperText={errors.name}
                />

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

          {/* Images */}
          <Typography mt={3} fontWeight={500}>
            Images (Max 5)
          </Typography>
          {errors.images && <Alert severity="error">{errors.images}</Alert>}

          <Box display="flex" gap={2} flexWrap="wrap" mt={1}>
            {images.map((file, index) => (
              <Box key={index} position="relative">
                <Box
                  component="img"
                  src={URL.createObjectURL(file)}
                  sx={{
                    width: 90,
                    height: 90,
                    objectFit: "cover",
                    borderRadius: 2,
                    border: "1px solid #ddd",
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => removeImage(index)}
                  sx={{ position: "absolute", top: -10, right: -10 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}

            {images.length < MAX_IMAGES && (
              <Button
                component="label"
                sx={{
                  width: 90,
                  height: 90,
                  border: "2px dashed #ccc",
                  borderRadius: 2,
                }}
              >
                <AddIcon />
                <input hidden multiple type="file" onChange={handleImageChange} />
              </Button>
            )}
          </Box>

          {/* Flags */}
          <Box mt={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.isFeatured}
                  onChange={handleChange}
                  name="isFeatured"
                />
              }
              label="Featured"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.isActive}
                  onChange={handleChange}
                  name="isActive"
                />
              }
              label="Active"
            />
          </Box>

          {/* Submit & Reset */}
        <Box mt={3} display="flex" gap={2}>
            <Button
                type="submit"
                variant="contained"
                sx={{ px: 4, py: 1.2, fontWeight: 600 }}
                disabled={loading}
            >
                {loading ? "Saving..." : "Create Product"}
            </Button>

            <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={handleReset}
                sx={{ px: 4, py: 1.2 }}
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