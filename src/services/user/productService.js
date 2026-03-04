import API from "../api";

export const getProducts = async (page = 1, limit = 10) => {
  const { data } = await API.get(`/api/products?page=${page}&limit=${limit}`);
  return data;
};

export const getProductById = async (id) => {
  const { data } = await API.get(`/api/products/${id}`);
  return data.data;
};