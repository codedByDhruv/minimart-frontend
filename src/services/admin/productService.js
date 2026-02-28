import API from "../api";

// 📦 Get Products
export const getProducts = async (params = {}) => {
  const { data } = await API.get("/api/products", { params });
  return data.data;
};

// 🔍 Get Product By ID
export const getProductById = async (id) => {
  const { data } = await API.get(`/api/products/${id}`);
  return data.data;
};

// ➕ Create Product
export const createProduct = async (formData) => {
  const { data } = await API.post("/api/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

// ✏️ Update Product
export const updateProduct = async (id, formData) => {
  const { data } = await API.put(`/api/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

// 🗑 Delete Product
export const deleteProduct = async (id) => {
  const { data } = await API.delete(`/api/products/${id}`);
  return data;
};