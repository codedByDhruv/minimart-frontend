import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Chip,
  Typography,
  CircularProgress,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Avatar,
  Divider,
  IconButton,
  Paper,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useEffect, useState } from "react";
import {
  getOrders,
  updateOrderStatus,
  updateTracking,
} from "../../services/admin/orderService";

const allowedStatuses = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Out for delivery",
  "Delivered",
  "Cancelled",
];

const OrderList = () => {
  const [rows, setRows] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [trackingDialog, setTrackingDialog] = useState(false);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [trackingForm, setTrackingForm] = useState({
    trackingNumber: "",
    estimatedDelivery: "",
  });

  /* ================= FETCH ================= */
  const fetchOrders = async () => {
    try {
      const res = await getOrders({ page: 1, limit: 10 });
      setOrders(res.orders);

      const mapped = res.orders.map((o) => ({
        id: o._id,
        customer: o.user?.name,
        amount: o.totalPrice,
        payment: o.paymentStatus,
        status: o.orderStatus,
        items: o.orderItems,
        trackingNumber: o.trackingNumber,
        estimatedDelivery: o.estimatedDelivery,
      }));

      setRows(mapped);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= STATUS UPDATE ================= */
  const handleStatusChange = async (id, newStatus) => {
    await updateOrderStatus(id, newStatus);
    fetchOrders();
  };

  /* ================= TRACKING ================= */
  const openTrackingDialog = (row) => {
    setSelectedOrder(row);
    setTrackingForm({
      trackingNumber: row.trackingNumber || "",
      estimatedDelivery: row.estimatedDelivery
        ? row.estimatedDelivery.split("T")[0]
        : "",
    });
    setTrackingDialog(true);
  };

  const handleTrackingSave = async () => {
    await updateTracking(selectedOrder.id, trackingForm);
    setTrackingDialog(false);
    fetchOrders();
  };

  /* ================= ORDER DETAILS ================= */
  const openDetails = (id) => {
    const order = orders.find((o) => o._id === id);
    setSelectedOrder(order);
    setDetailsDialog(true);
  };

  /* ================= COLUMNS ================= */
  const columns = [
    { field: "id", headerName: "Order ID", flex: 1 },

    { field: "customer", headerName: "Customer", flex: 1 },

    {
      field: "amount",
      headerName: "Amount (₹)",
      flex: 1,
      renderCell: (params) => (
        <Typography fontWeight={600}>₹{params.value}</Typography>
      ),
    },

    {
      field: "payment",
      headerName: "Payment",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: params.value === "Paid" ? "#ecfdf5" : "#fff7ed",
            color: params.value === "Paid" ? "#047857" : "#c2410c",
            fontWeight: 600,
          }}
        />
      ),
    },

    {
      field: "status",
      headerName: "Status",
      flex: 1.2,
      renderCell: (params) => {
        const isCancelled = params.value === "Cancelled";

        return (
          <Select
            size="small"
            value={params.value}
            disabled={isCancelled}
            onChange={(e) =>
              handleStatusChange(params.row.id, e.target.value)
            }
            sx={{
              minWidth: 140,
              bgcolor: isCancelled ? "#fef2f2" : "#f9fafb",
              color: isCancelled ? "#b91c1c" : "#111",
              fontWeight: 500,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e5e7eb",
              },
            }}
          >
            {allowedStatuses.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },

    {
      field: "tracking",
      headerName: "Tracking",
      flex: 1,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          disabled={params.row.status === "Cancelled"}
          onClick={() => openTrackingDialog(params.row)}
          sx={{
            borderColor: "#111",
            color: "#111",
            "&:hover": { bgcolor: "#f3f4f6", borderColor: "#111" },
          }}
        >
          {params.row.trackingNumber ? "Update" : "Add"}
        </Button>
      ),
    },

    {
      field: "view",
      headerName: "View",
      width: 80,
      renderCell: (params) => (
        <IconButton
          onClick={() => openDetails(params.row.id)}
          sx={{
            color: "#374151",
            "&:hover": { bgcolor: "#f3f4f6" },
          }}
        >
          <VisibilityOutlinedIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Orders
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
        {loading ? (
          <Box p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: 520 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick
              getRowHeight={() => 72}
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
        )}
      </Paper>

      {/* ================= TRACKING MODAL ================= */}
      <Dialog open={trackingDialog} onClose={() => setTrackingDialog(false)}>
        <DialogTitle>Update Tracking</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Tracking Number"
              fullWidth
              value={trackingForm.trackingNumber}
              onChange={(e) =>
                setTrackingForm({
                  ...trackingForm,
                  trackingNumber: e.target.value,
                })
              }
            />
            <TextField
              label="Estimated Delivery"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={trackingForm.estimatedDelivery}
              onChange={(e) =>
                setTrackingForm({
                  ...trackingForm,
                  estimatedDelivery: e.target.value,
                })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setTrackingDialog(false)}
            sx={{ color: "#374151" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleTrackingSave}
            sx={{ bgcolor: "#111", "&:hover": { bgcolor: "#000" } }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= ORDER DETAILS MODAL ================= */}
      <Dialog open={detailsDialog} onClose={() => setDetailsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography fontWeight={600}>
                Customer: {selectedOrder.user.name}
              </Typography>
              <Typography variant="body2" mb={2}>
                {selectedOrder.shippingAddress.street},{" "}
                {selectedOrder.shippingAddress.city}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {selectedOrder.orderItems.map((item) => (
                <Stack key={item.product} direction="row" spacing={2} mb={2}>
                  <Avatar
                    src={`${import.meta.env.VITE_ECOM_BASE_URL}/uploads/${item.image}`}
                    variant="rounded"
                  />
                  <Box>
                    <Typography>{item.name}</Typography>
                    <Typography variant="caption">
                      Qty: {item.quantity} • ₹{item.price}
                    </Typography>
                  </Box>
                </Stack>
              ))}

              <Divider sx={{ my: 2 }} />

              <Typography>Items Price: ₹{selectedOrder.itemsPrice}</Typography>
              <Typography fontWeight={700}>
                Total: ₹{selectedOrder.totalPrice}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDetailsDialog(false)}
            sx={{ color: "#374151" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderList;