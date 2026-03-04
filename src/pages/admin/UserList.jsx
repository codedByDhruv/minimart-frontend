import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  IconButton,
  Chip,
  Typography,
  Tooltip,
  Paper,
} from "@mui/material";

import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { getUsers, toggleBlockUser } from "../../services/admin/adminUserService";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const data = await getUsers({
        page: page + 1,
        limit: pageSize,
      });

      const mappedUsers = data.users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.isBlocked ? "Blocked" : "Active",
      }));

      setUsers(mappedUsers);
      setRowCount(data.totalUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize]);

  /* ================= BLOCK / UNBLOCK ================= */
  const handleBlockToggle = async (id) => {
    await toggleBlockUser(id);
    fetchUsers();
  };

  /* ================= COLUMNS ================= */
  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.3 },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ textTransform: "capitalize" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: params.value === "Active" ? "#ecfdf5" : "#fef2f2",
            color: params.value === "Active" ? "#047857" : "#b91c1c",
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const isBlocked = params.row.status === "Blocked";

        return (
          <Box>
            <Tooltip title="View User">
              <IconButton
                sx={{
                  color: "#374151",
                  "&:hover": { bgcolor: "#f3f4f6" },
                }}
              >
                <VisibilityOutlinedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={isBlocked ? "Unblock User" : "Block User"}>
              <IconButton
                onClick={() => handleBlockToggle(params.row.id)}
                sx={{
                  color: isBlocked ? "#047857" : "#b91c1c",
                  "&:hover": {
                    bgcolor: isBlocked ? "#ecfdf5" : "#fee2e2",
                  },
                }}
              >
                {isBlocked ? <LockOpenOutlinedIcon /> : <BlockOutlinedIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Box>
      {/* HEADER */}
      <Typography variant="h5" fontWeight={700} mb={2}>
        Users
      </Typography>

      {/* TABLE */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <Box sx={{ height: 520 }}>
          <DataGrid
            rows={users}
            columns={columns}
            pagination
            paginationMode="server"
            rowCount={rowCount}
            page={page}
            pageSize={pageSize}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newSize) => setPageSize(newSize)}
            rowsPerPageOptions={[5, 10, 20, 50]}
            loading={loading}
            disableRowSelectionOnClick
            sx={{
              border: 0,
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: "#f9fafb",
                fontWeight: 600,
              },
              "& .MuiDataGrid-row:hover": {
                bgcolor: "#f9fafb",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #eee",
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default UserList;