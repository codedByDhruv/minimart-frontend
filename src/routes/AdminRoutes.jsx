import { Navigate } from "react-router-dom";
import { isAdmin } from "../services/authService";

const AdminRoutes = ({ children }) => {
  if (!isAdmin()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoutes;