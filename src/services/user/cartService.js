import API from "../api";

// 🛒 Add to Cart
export const addToCart = async (productId, quantity) => {
  const res = await API.post("/api/cart/", {
    productId,
    quantity,
  });
  return res.data;
};

// 🛒 Get Cart
export const getCart = async () => {
  const { data } = await API.get("/api/cart");
  return data.data;
};

// 🛒 Update Cart
export const updateCart = async (productId, quantity) => {
  const res = await API.put(`/api/cart/${productId}`, {
    quantity,
  });
  return res.data;
};

// 🛒 Remove Cart Item
export const deleteCartItem = async (productId) => {
  const res = await API.delete(`/api/cart/${productId}`);
  return res.data;
};