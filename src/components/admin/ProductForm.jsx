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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { getCategories } from "../../services/admin/categoryService";

const MAX_IMAGES = 5;

const ProductForm = ({ initialData = {}, onSubmit, loading }) => {
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
  const [images, setImages] = useState([]); // new files
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]); // ✅ track deletions

  // 🔹 Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data.categories);
    };
    fetchCategories();
  }, []);

  // 🔹 Prefill data for edit
  useEffect(() => {
    if (initialData._id) {
      setForm({
        name: initialData.name || "",
        price: initialData.price || "",
        countInStock: initialData.countInStock || "",
        category: initialData.category?._id || "",
        description: initialData.description || "",
        isFeatured: initialData.isFeatured || false,
        isActive: initialData.isActive ?? true,
      });

      setExistingImages(initialData.images || []);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // ➕ Add images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + existingImages.length + files.length > MAX_IMAGES) {
      alert("Maximum 5 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...files]);
  };

  // ❌ Remove newly added image
  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ❌ Remove existing image → track deletion
  const removeExistingImage = (img) => {
    setExistingImages((prev) => prev.filter((i) => i !== img));
    setDeletedImages((prev) => [...prev, img]); // ✅ track for backend
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    // append fields
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    // append new images
    images.forEach((img) => formData.append("images", img));

    // append deleted images
    if (deletedImages.length > 0) {
      formData.append("deleteImages", JSON.stringify(deletedImages));
    }

    onSubmit(formData);
  };

  const totalImages = existingImages.length + images.length;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 650 }}>
      <Typography variant="h6" mb={2}>
        Product Details
      </Typography>

      {/* Name */}
      <TextField
        label="Product Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />

      {/* Price */}
      <TextField
        label="Price"
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />

      {/* Stock */}
      <TextField
        label="Stock"
        name="countInStock"
        type="number"
        value={form.countInStock}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      {/* Category Dropdown */}
      <TextField
        select
        label="Category"
        name="category"
        value={form.category}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {categories.map((cat) => (
          <MenuItem key={cat._id} value={cat._id}>
            {cat.name}
          </MenuItem>
        ))}
      </TextField>

      {/* Description */}
      <TextField
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
        margin="normal"
      />

      {/* Image Upload Grid */}
      <Typography mt={2}>Images (Max 5)</Typography>
      <Box display="flex" gap={2} flexWrap="wrap" mt={1}>
        {/* Existing */}
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
              sx={{ position: "absolute", top: -10, right: -10 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}

        {/* New */}
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
              sx={{ position: "absolute", top: -10, right: -10 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}

        {/* Upload */}
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

      {/* Flags */}
      <Box mt={2}>
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

      <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={loading}>
        {loading ? "Saving..." : "Save Product"}
      </Button>
    </Box>
  );
};

export default ProductForm;