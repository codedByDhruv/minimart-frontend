import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../../services/authService";
import Logo from "../../assets/images/Logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  const menuItemsBeforeLogin = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "Login", path: "/login" },
    { label: "Register", path: "/register" },
  ];

  const menuItemsAfterLogin = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "Cart", path: "/cart" },
    // { label: "Wishlist", path: "/wishlist" },
    { label: "Orders", path: "/orders" },
  ];

  const menuItems = user ? menuItemsAfterLogin : menuItemsBeforeLogin;

  return (
    <>
      {/* ================= APP BAR ================= */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "#fff",
          color: "#111",
          borderBottom: "1px solid #eee",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* 🔹 Logo */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <img src={Logo} alt="Minimart" style={{ width: 36 }} />
            <Typography variant="h6" fontWeight={700}>
              Minimart
            </Typography>
          </Box>

          {/* 🔹 Desktop Menu */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {menuItems.map((item) => (
              <Button
                key={item.label}
                onClick={() => navigate(item.path)}
                sx={{
                  color: "#111",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
              >
                {item.label}
              </Button>
            ))}

            {/* 🔹 Profile Menu */}
            {user && (
              <>
                <Button
                  onClick={openMenu}
                  startIcon={<AccountCircleOutlinedIcon />}
                  sx={{
                    color: "#111",
                    textTransform: "none",
                    "&:hover": { bgcolor: "#f5f5f5" },
                  }}
                >
                  {user.name.split(" ")[0]}
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={closeMenu}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      mt: 1,
                      borderRadius: 2,
                      border: "1px solid #eee",
                      minWidth: 180,
                    },
                  }}
                >
                  <MenuItem disabled>
                    <ListItemIcon>
                      <AccountCircleOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    {user.name}
                  </MenuItem>

                  <Divider />

                  <MenuItem
                    onClick={() => {
                      closeMenu();
                      navigate("/profile");
                    }}
                    sx={{ "&:hover": { bgcolor: "#f5f5f5" } }}
                  >
                    <ListItemIcon>
                      <AccountCircleOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>

                  <MenuItem
                    onClick={handleLogout}
                    sx={{ "&:hover": { bgcolor: "#f5f5f5" } }}
                  >
                    <ListItemIcon>
                      <LogoutOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>

          {/* 🔹 Mobile Icon */}
          <IconButton
            sx={{ display: { xs: "block", md: "none" }, color: "#111" }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* ================= MOBILE DRAWER ================= */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260 }}>
          {/* Logo */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            p={2}
            onClick={() => {
              navigate("/");
              setDrawerOpen(false);
            }}
          >
            <img src={Logo} alt="Minimart" style={{ width: 32 }} />
            <Typography variant="h6" fontWeight={700}>
              Minimart
            </Typography>
          </Box>

          <Divider />

          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}

            {user && (
              <>
                <Divider />

                <ListItem>
                  <ListItemText primary={user.name} />
                </ListItem>

                <ListItem
                  button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;