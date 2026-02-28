import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const drawerWidth = 260;
const collapsedWidth = 80;

const AdminLayout = ({ mode, setMode }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        drawerWidth={drawerWidth}
        collapsedWidth={collapsedWidth}
        collapsed={collapsed}
      />

      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default" }}>
        <Topbar
          drawerWidth={collapsed ? collapsedWidth : drawerWidth}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mode={mode}
          setMode={setMode}
        />

        <Box sx={{ p: 3, mt: 10 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;