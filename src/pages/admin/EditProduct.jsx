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
import { useParams, useNavigate } from "react-router-dom";

import {
  getProductById,
  updateProduct,
} from "../../services/admin/productService";
import { getCategories } from "../../services/admin/categoryService";

const MAX_IMAGES = 5;

const EditProduct = () => {
  const { id } = useParams();
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
  const [existingImages, setExistingImages] = useState([]);
  const [images, setImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔹 Load product + categories
  useEffect(() => {
    const fetchData = async () => {
      const [product, catData] = await Promise.all([
        getProductById(id),
        getCategories(),
      ]);

      setForm({
        name: product.name || "",
        price: product.price || "",
        countInStock: product.countInStock || "",
        category: product.category?._id || "",
        description: product.description || "",
        isFeatured: product.isFeatured || false,
        isActive: product.isActive ?? true,
      });

      setExistingImages(product.images || []);
      setCategories(catData.categories);
    };

    fetchData();
  }, [id]);

  // 🔹 Validation
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.price || form.price <= 0) newErrors.price = "Valid price required";
    if (!form.countInStock) newErrors.countInStock = "Stock is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (existingImages.length + images.length === 0)
      newErrors.images = "At least 1 image required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // ➕ Add new images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (existingImages.length + images.length + files.length > MAX_IMAGES) {
      alert("Maximum 5 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...files]);
  };

  // ❌ Remove new image
  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ❌ Remove existing image
  const removeExistingImage = (img) => {
    setExistingImages((prev) => prev.filter((i) => i !== img));
    setDeletedImages((prev) => [...prev, img]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();

    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    images.forEach((img) => formData.append("images", img));

    if (deletedImages.length) {
      formData.append("deleteImages", JSON.stringify(deletedImages));
    }

    try {
      setLoading(true);
      await updateProduct(id, formData);
      navigate("/admin/products");
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  const totalImages = existingImages.length + images.length;

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
        <Typography variant="h5" fontWeight={600} mb={3}>
          Edit Product
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
              <TextField
                label="Product Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                size="small"
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
                size="small"
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
                size="small"
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
                size="small"
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
                size="small"
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>

          {/* Images */}
          <Box mt={4}>
            <Typography fontWeight={500} mb={1}>
              Images (Max 5)
            </Typography>
            {errors.images && <Alert severity="error">{errors.images}</Alert>}

            <Box display="flex" gap={2} flexWrap="wrap">
              {existingImages.map((img) => (
                <Box key={img} position="relative">
                  <Box
                    component="img"
                    src={`${import.meta.env.VITE_ECOM_BASE_URL}/uploads/${img}`}
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 2,
                      border: "1px solid #ddd",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeExistingImage(img)}
                    sx={{ position: "absolute", top: -8, right: -8 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}

              {images.map((file, index) => (
                <Box key={index} position="relative">
                  <Box
                    component="img"
                    src={URL.createObjectURL(file)}
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 2,
                      border: "1px solid #ddd",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeNewImage(index)}
                    sx={{ position: "absolute", top: -8, right: -8 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}

              {totalImages < MAX_IMAGES && (
                <Button
                  component="label"
                  sx={{
                    width: 80,
                    height: 80,
                    border: "2px dashed #ccc",
                    borderRadius: 2,
                  }}
                >
                  <AddIcon />
                  <input hidden multiple type="file" onChange={handleImageChange} />
                </Button>
              )}
            </Box>
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

          <Box mt={3}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Saving..." : "Update Product"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditProduct;