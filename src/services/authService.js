import API from "./api";
// 🔐 Login (Admin or User)
export const login = async (email, password) => {
  try {
    const { data } = await API.post("/api/auth/login", {
      email,
      password,
    });

    if (!data.success) {
      throw new Error(data.message || "Login failed");
    }

    return data.data; // { token, user }
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// ✅ Save session
export const saveSession = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

// 🚪 Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// 👤 Get Current User
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

// 🛡️ Check Admin
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === "admin";
};

// 📝 Register User
export const register = async (formData) => {
  try {
    const { data } = await API.post("/api/auth/register", formData);

    if (!data.success) {
      throw new Error(data.message || "Registration failed");
    }

    const { token, user } = data.data;

    // ✅ Save token & user (auto login after register)
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await API.post("/api/auth/forgot-password", { email });
    return res.data;
  } catch (err) {
    throw err?.response?.data?.message || "Something went wrong";
  }
};

export const resetPassword = async (token, password) => {
  try {
    const res = await API.post(`/api/auth/reset-password/${token}`, {
      password,
    });
    return res.data;
  } catch (err) {
    throw err?.response?.data?.message || "Password reset failed";
  }
};

export const changePassword = async (data) => {
  try {
    const res = await API.put("/api/auth/change-password", data);
    return res.data;
  } catch (err) {
    throw err?.response?.data?.message || "Password change failed";
  }
};