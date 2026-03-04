import API from "../api";

// profile
export const getProfile = async () => {
  const { data } = await API.get("/api/users/profile");
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await API.put("/api/users/profile", payload);
  return data;
};

// address
export const addAddress = async (payload) => {
  const { data } = await API.post("/api/users/address", payload);
  return data;
};

export const updateAddress = async (id, payload) => {
  const { data } = await API.put(`/api/users/address/${id}`, payload);
  return data;
};

export const deleteAddress = async (id) => {
  const { data } = await API.delete(`/api/users/address/${id}`);
  return data;
};

export const setDefaultAddress = async (id) => {
  const { data } = await API.put(`/api/users/address/${id}/default`);
  return data;
};