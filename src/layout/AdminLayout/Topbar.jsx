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
  ListItemIcon,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

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
      elevation={0}
      sx={{
        height: TOPBAR_HEIGHT,
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        bgcolor: "#fff",
        color: "#111",
        borderBottom: "1px solid #eee",
      }}
    >
      <Toolbar sx={{ minHeight: TOPBAR_HEIGHT }}>
        {/* 🔹 Menu Toggle */}
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{
            color: "#333",
            transition: "0.2s",
            "&:hover": { bgcolor: "#f2f2f2" },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        {/* 🔹 Profile Section */}
        <Box
          display="flex"
          alignItems="center"
          gap={1.5}
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            transition: "0.2s",
            cursor: "pointer",
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
          onClick={openMenu}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: "#111",
              fontSize: 14,
            }}
          >
            A
          </Avatar>

          <Typography fontWeight={600} fontSize={14}>
            Admin
          </Typography>
        </Box>

        {/* 🔹 Profile Menu */}
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
            Admin
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={handleLogout}
            sx={{
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
          >
            <ListItemIcon>
              <LogoutOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;