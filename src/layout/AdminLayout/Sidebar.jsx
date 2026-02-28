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

import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AppsIcon from "@mui/icons-material/Apps";

import { NavLink } from "react-router-dom";

const Sidebar = ({ drawerWidth, collapsedWidth, collapsed }) => {
  const menu = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    { text: "Products", icon: <Inventory2Icon />, path: "/admin/products" },
    { text: "Categories", icon: <CategoryIcon />, path: "/admin/categories" },
    { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
    { text: "Orders", icon: <ShoppingCartIcon />, path: "/admin/orders" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? collapsedWidth : drawerWidth,
        "& .MuiDrawer-paper": {
          width: collapsed ? collapsedWidth : drawerWidth,
          bgcolor: "background.paper",
          borderRight: "none",
          boxShadow: "4px 0 20px rgba(0,0,0,0.05)",
          transition: "width 0.3s",
        },
      }}
    >
      {/* ===== Sidebar Header ===== */}
      <Box
        sx={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          px: collapsed ? 0 : 3,
        }}
      >
        <AppsIcon color="primary" sx={{ fontSize: 30 }} />
        {!collapsed && (
          <Typography variant="h6" fontWeight={700} ml={1}>
            Minimart Admin
          </Typography>
        )}
      </Box>

      <Divider />

      {/* ===== Menu ===== */}
      <List sx={{ mt: 1 }}>
        {menu.map((item) => (
          <Tooltip
            key={item.text}
            title={collapsed ? item.text : ""}
            placement="right"
          >
            <ListItemButton
              component={NavLink}
              to={item.path}
              end={item.path === "/admin"}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 2,
                px: collapsed ? 1.5 : 2,
                justifyContent: collapsed ? "center" : "flex-start",
                "&.active": {
                  bgcolor: "primary.main",
                  color: "#fff",
                  "& .MuiListItemIcon-root": {
                    color: "#fff",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? 0 : 1.5,
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>

              {!collapsed && <ListItemText primary={item.text} />}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;