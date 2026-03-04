import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Box,
  Typography,
  Divider,
} from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import { NavLink } from "react-router-dom";
import Logo from "../../assets/images/Logo.png";

const Sidebar = ({ drawerWidth, collapsedWidth, collapsed }) => {
  const menu = [
    { text: "Dashboard", icon: <DashboardOutlinedIcon />, path: "/admin" },
    { text: "Products", icon: <Inventory2OutlinedIcon />, path: "/admin/products" },
    { text: "Categories", icon: <CategoryOutlinedIcon />, path: "/admin/categories" },
    { text: "Users", icon: <PeopleOutlinedIcon />, path: "/admin/users" },
    { text: "Orders", icon: <ShoppingCartOutlinedIcon />, path: "/admin/orders" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? collapsedWidth : drawerWidth,
        "& .MuiDrawer-paper": {
          width: collapsed ? collapsedWidth : drawerWidth,
          bgcolor: "#fff",
          borderRight: "1px solid #eee",
          transition: "width 0.3s ease",
        },
      }}
    >
      {/* ===== Header ===== */}
      <Box
        sx={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          px: 2,
        }}
      >
        <Box component="img" src={Logo} alt="Minimart Logo" sx={{ height: 34 }} />

        {!collapsed && (
          <Typography variant="h6" fontWeight={700} ml={1}>
            Minimart Admin
          </Typography>
        )}
      </Box>

      <Divider />

      {/* ===== Menu ===== */}
      <List disablePadding sx={{ mt: 1 }}>
        {menu.map((item) => (
          <Tooltip key={item.text} title={collapsed ? item.text : ""} placement="right">
            <ListItemButton
              component={NavLink}
              to={item.path}
              end={item.path === "/admin"}
              sx={{
                px: collapsed ? 2 : 3,
                py: 1.2,
                justifyContent: collapsed ? "center" : "flex-start",
                color: "#222",
                transition: "all 0.25s ease",

                "& .MuiListItemIcon-root": {
                  color: "#222",
                  minWidth: 0,
                  mr: collapsed ? 0 : 2,
                  justifyContent: "center",
                  transition: "color 0.25s ease",
                },

                // 🔹 Hover effect (grey full width)
                "&:hover": {
                  bgcolor: "#f2f2f2",
                },

                // 🔹 Active route (full width dark)
                "&.active": {
                  bgcolor: "#111",
                  color: "#fff",

                  "& .MuiListItemIcon-root": {
                    color: "#fff",
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              {!collapsed && <ListItemText primary={item.text} />}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;