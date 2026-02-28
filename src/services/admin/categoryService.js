import API from "../api";

// 📦 Get Categories
export const getCategories = async (params = {}) => {
  const { data } = await API.get("/api/categories", { params });
  return data.data;
};

// ➕ Create Category
export const createCategory = async (payload) => {
  const { data } = await API.post("/api/categories", payload);
  return data;
};

// ✏️ Update Category
export const updateCategory = async (id, payload) => {
  const { data } = await API.put(`/api/categories/${id}`, payload);
  return data;
};

// 🗑 Delete Category
export const deleteCategory = async (id) => {
  const { data } = await API.delete(`/api/categories/${id}`);
  return data;
};