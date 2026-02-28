import { BrowserRouter, Routes, Route } from "react-router-dom";

// 🔐 Auth Pages
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";

// 🛍️ User Pages
import Home from "./pages/user/Home";
import Products from "./pages/user/Products";
import ProductDetails from "./pages/user/ProductDetails";
import Cart from "./pages/user/Cart";
import Wishlist from "./pages/user/Wishlist";
import Orders from "./pages/user/Orders";
import UserLayout from "./layout/UserLayout/UserLayout";

// 🔒 Admin Pages
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProductList from "./pages/admin/ProductList";
import UserList from "./pages/admin/UserList";
import OrderList from "./pages/admin/OrderList";
import AdminLayout from "./layout/AdminLayout/AdminLayout";
import AdminRoutes from "./routes/AdminRoutes";
import CategoryList from "./pages/admin/CategoryList";
import CreateProduct from "./pages/admin/CreateProduct";
import EditProduct from "./pages/admin/EditProduct";

const App = ({ mode, setMode }) => {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🛍️ User Website */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="orders" element={<Orders />} />
        </Route>

        {/* 🔒 Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* 🔒 Admin Panel */}
        <Route
          path="/admin"
          element={
            <AdminRoutes>
              <AdminLayout mode={mode} setMode={setMode} />
            </AdminRoutes>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="users" element={<UserList />} />
          <Route path="orders" element={<OrderList />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;