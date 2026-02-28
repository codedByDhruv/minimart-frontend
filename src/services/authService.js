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

    const { token, user } = data.data;

    // ✅ Save token for interceptor
    localStorage.setItem("token", token);

    // ✅ Save user info
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// 🚪 Logout
export const logout = () => {
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