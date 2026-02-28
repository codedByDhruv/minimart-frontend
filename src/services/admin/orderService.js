import API from "../api";

// 📦 Get Orders
export const getOrders = async (params = {}) => {
  const { data } = await API.get("/api/admin/orders", { params });
  return data.data;
};

// 🔄 Update Order Status
export const updateOrderStatus = async (id, status) => {
  const { data } = await API.put(`/api/admin/orders/${id}/status`, { status });
  return data;
};

// 🚚 Update Tracking
export const updateTracking = async (id, payload) => {
  const { data } = await API.put(
    `/api/admin/orders/${id}/tracking`,
    payload
  );
  return data;
};