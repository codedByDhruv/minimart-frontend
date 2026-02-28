import API from "../api";

export const getDashboardStats = async () => {
  try {
    const { data } = await API.get("/api/admin/dashboard");

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to load dashboard";
  }
};