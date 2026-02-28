import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";

const Topbar = ({ drawerWidth, collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const TOPBAR_HEIGHT = 64;

  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate("/admin/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        height: TOPBAR_HEIGHT,
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        bgcolor: "background.paper",
        color: "text.primary",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <Toolbar>
        {/* Menu Toggle */}
        <IconButton onClick={() => setCollapsed(!collapsed)}>
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        {/* ===== Right Section ===== */}
        <Box
          display="flex"
          alignItems="center"
          gap={1.5}
          sx={{ cursor: "pointer" }}
          onClick={openMenu}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
              fontSize: 14,
            }}
          >
            A
          </Avatar>

          <Typography fontWeight={600}>Admin</Typography>
        </Box>

        {/* ===== Profile Menu ===== */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={closeMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem disabled>
            <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
            Admin
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogout}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;