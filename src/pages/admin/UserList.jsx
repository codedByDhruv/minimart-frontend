import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  IconButton,
  Chip,
  Typography,
  Tooltip,
} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { getUsers, toggleBlockUser } from "../../services/admin/adminUserService";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch users
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
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Block/Unblock
  const handleBlockToggle = async (id) => {
    try {
      await toggleBlockUser(id);
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user status", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize]);

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Active" ? "success" : "error"}
          size="small"
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
          <>
            <Tooltip title="View user">
              <IconButton color="primary">
                <VisibilityIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={isBlocked ? "Unblock User" : "Block User"}>
              <IconButton
                color={isBlocked ? "success" : "error"}
                onClick={() => handleBlockToggle(params.row.id)}
              >
                {isBlocked ? <LockOpenIcon /> : <BlockIcon />}
              </IconButton>
            </Tooltip>
          </>
        );
      },
    }
  ];

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Users
      </Typography>

      <Box sx={{ height: 500 }}>
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
          rowsPerPageOptions={[5, 10, 20]}
          loading={loading}
        />
      </Box>
    </Box>
  );
};

export default UserList;