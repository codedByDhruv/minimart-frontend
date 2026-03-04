import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Chip,
  Pagination
} from "@mui/material";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getMyOrders,
  cancelOrder,
  getOrderById
} from "../../services/user/orderService";

import OrderDetailDialog from "../../components/OrderDetailDialog";

const Orders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const data = await getMyOrders(pageNumber, limit);

      setOrders(data.orders);
      setTotalPages(data.totalPages);
      setPage(pageNumber);

    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const handleView = async (id) => {
    try {
      const data = await getOrderById(id);
      setSelectedOrder(data);
      setOpen(true);
    } catch {
      toast.error("Failed to load order");
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelOrder(id);
      toast.success("Order cancelled");
      fetchOrders(page);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const handlePageChange = (e, value) => {
    fetchOrders(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return { bgcolor: "#fff3cd", color: "#856404" };

      case "Confirmed":
        return { bgcolor: "#e2e3e5", color: "#383d41" };

      case "Shipped":
        return { bgcolor: "#e0e7ff", color: "#3730a3" };

      case "Out for delivery":
        return { bgcolor: "#ede9fe", color: "#5b21b6" };

      case "Delivered":
        return { bgcolor: "#d1fae5", color: "#065f46" };

      case "Cancelled":
        return { bgcolor: "#fee2e2", color: "#991b1b" };

      default:
        return { bgcolor: "#f5f5f5", color: "#111" };
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 10, px: 2 }}>
      <Box maxWidth={1200} mx="auto">

        <Typography variant="h4" fontWeight={700} mb={5}>
          My Orders
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            border: "1px solid #eee"
          }}
        >

          <Table>

            <TableHead>

              <TableRow>

                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell align="center">Actions</TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {orders?.map((order) => {

                const firstProduct = order.orderItems[0];

                return (

                  <TableRow key={order._id} hover>

                    <TableCell>
                      #{order._id.slice(-6)}
                    </TableCell>

                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>

                    {/* PRODUCT PREVIEW */}
                    <TableCell>

                      <Box display="flex" alignItems="center" gap={2}>

                        <Box
                          component="img"
                          src={`${import.meta.env.VITE_ECOM_BASE_URL}/uploads/${firstProduct?.image}`}
                          alt={firstProduct?.name}
                          sx={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: 2,
                            border: "1px solid #eee"
                          }}
                        />

                        <Box>

                          <Typography variant="body2" fontWeight={500}>
                            {firstProduct?.name}
                          </Typography>

                          {order.orderItems.length > 1 && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              +{order.orderItems.length - 1} more
                            </Typography>
                          )}

                        </Box>

                      </Box>

                    </TableCell>

                    <TableCell>
                      {order.orderItems.length}
                    </TableCell>

                    <TableCell>
                      ₹{order.totalPrice}
                    </TableCell>

                    {/* ORDER STATUS */}
                    <TableCell>
                      <Chip
                        label={order.orderStatus}
                        sx={{
                          ...getStatusColor(order.orderStatus),
                          fontWeight: 600
                        }}
                      />
                    </TableCell>

                    {/* PAYMENT STATUS */}
                    <TableCell>

                      <Chip
                        label={order.paymentStatus}
                        sx={{
                          bgcolor:
                            order.paymentStatus === "Pending"
                              ? "#fff3cd"
                              : "#d1fae5",

                          color:
                            order.paymentStatus === "Pending"
                              ? "#856404"
                              : "#065f46"
                        }}
                      />

                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell align="center">

                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          bgcolor: "#111",
                          textTransform: "none",
                          mr: 1
                        }}
                        onClick={() => handleView(order._id)}
                      >
                        View
                      </Button>

                      {order.orderStatus === "Pending" && (
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: "#111",
                            color: "#111",
                            textTransform: "none"
                          }}
                          onClick={() => handleCancel(order._id)}
                        >
                          Cancel
                        </Button>
                      )}

                    </TableCell>

                  </TableRow>

                );
              })}

            </TableBody>

          </Table>

        </TableContainer>

        {/* PAGINATION */}

        <Box display="flex" justifyContent="center" mt={4}>

          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            shape="rounded"
            sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#111",
                  },
                  "& .Mui-selected": {
                    bgcolor: "#111 !important",
                    color: "#fff",
                  },
                }}
          />

        </Box>

        <OrderDetailDialog
          open={open}
          onClose={() => setOpen(false)}
          order={selectedOrder}
        />

      </Box>
    </Box>
  );
};

export default Orders;