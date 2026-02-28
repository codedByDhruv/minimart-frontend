import API from "../api";

// 👥 Get Users (Pagination + Search)
export const getUsers = async (params = {}) => {
  const { data } = await API.get("/api/admin/users", { params });
  return data.data; // returns { users, totalUsers, totalPages, page }
};

// 🚫 Block / Unblock User
export const toggleBlockUser = async (id) => {
  const { data } = await API.put(`/api/admin/users/${id}/block`);
  return data.data; // returns { userId, isBlocked }
};