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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
    } catch (err) {
      console.error("Failed to fetch orders", err);
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
    },

    {
      field: "payment",
      headerName: "Payment",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Paid" ? "success" : "warning"}
          size="small"
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
              backgroundColor: isCancelled ? "#FEE2E2" : "transparent",
              color: isCancelled ? "#991B1B" : "inherit",
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
        >
          {params.row.trackingNumber ? "Update" : "Add"}
        </Button>
      ),
    },

    /* 🆕 VIEW DETAILS */
    {
      field: "view",
      headerName: "View",
      width: 80,
      renderCell: (params) => (
        <IconButton onClick={() => openDetails(params.row.id)}>
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Orders
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ height: 520 }}>
          <DataGrid rows={rows} columns={columns} disableRowSelectionOnClick getRowHeight={() => 72} />
        </Box>
      )}

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
          <Button onClick={() => setTrackingDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleTrackingSave}>
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
              <Typography>Total: ₹{selectedOrder.totalPrice}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderList;