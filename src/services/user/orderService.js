import API from "../api";

export const placeOrder = async (addressId) => {
  const { data } = await API.post("/api/orders/", {
    addressId
  });

  return data;
};

export const getMyOrders = async (page = 1, limit = 10) => {
  const { data } = await API.get(`/api/orders/my-orders?page=${page}&limit=${limit}`);
  return data.data;
};

export const getOrderById = async (id) => {
  const { data } = await API.get(`/api/orders/${id}`);
  return data.data;
};

export const cancelOrder = async (id) => {
  const { data } = await API.put(`/api/orders/${id}/cancel`);
  return data;
};