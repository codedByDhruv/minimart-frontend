import {
  Grid,
  Paper,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Chip,
  Container,
  Avatar,
} from "@mui/material";

import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/admin/adminDashboardService";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getDashboardStats();
      setStats(data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const kpiCards = [
    { title: "Revenue", value: `₹${stats?.totalSales ?? 0}`, icon: <CurrencyRupeeOutlinedIcon /> },
    { title: "Orders", value: stats?.totalOrders ?? 0, icon: <ShoppingCartOutlinedIcon /> },
    { title: "Users", value: stats?.totalUsers ?? 0, icon: <PeopleOutlinedIcon /> },
    { title: "Low Stock", value: stats?.lowStockProducts?.length ?? 0, icon: <InventoryOutlinedIcon /> },
  ];

  return (
    <Box sx={{ bgcolor: "#f6f7f9", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="xl">
        <Grid container spacing={2.5}>
          {/* ================= KPI CARDS ================= */}
          { kpiCards.map((card) => (
            <Grid key={card.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: "1px solid #e5e7eb",
                  bgcolor: "#fff",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
                  },
                }}
              >
                {/* Black accent bar */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: 3,
                    bgcolor: "#000",
                  }}
                />

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>

                    <Typography variant="h4" fontWeight={700}>
                      {card.value}
                    </Typography>
                  </Box>

                  {/* Icon badge */}
                  <Box
                    sx={{
                      bgcolor: "#f3f4f6",
                      borderRadius: "50%",
                      p: 1.5,
                      color: "#222",
                      transition: "0.2s",
                      "&:hover": { bgcolor: "#e5e7eb" },
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}

          {/* ================= RECENT ORDERS ================= */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                bgcolor: "#fff",
                height: "100%",
                transition: "all 0.2s",
                "&:hover": {
                  boxShadow: "0 10px 20px rgba(0,0,0,0.06)",
                },
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Orders
              </Typography>

              {stats.recentOrders?.length > 0 ? (
                stats.recentOrders.map((order, index) => (
                  <Box
                    key={order._id}
                    sx={{
                      py: 1.5,
                      px: 1,
                      borderRadius: 2,
                      transition: "0.2s",
                      "&:hover": { bgcolor: "#f9fafb" },
                    }}
                  >
                    <Grid container alignItems="center">
                      <Grid size={8}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {order.user?.name?.[0] || "G"}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600}>
                              {order.user?.name || "Guest"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              #{order._id.slice(-6)} • {order.shippingAddress?.city || "N/A"}
                            </Typography>
                          </Box>
                        </Box>

                        <Typography variant="body2" color="text.secondary" ml={5}>
                          {order.orderItems?.length || 0} items • {order.paymentMethod}
                        </Typography>
                      </Grid>

                      <Grid size={4} textAlign="right">
                        <Typography fontWeight={700}>
                          ₹{order.totalPrice}
                        </Typography>

                        <Chip
                          size="small"
                          label={order.orderStatus}
                          sx={{
                            mt: 0.5,
                            fontWeight: 600,
                            bgcolor:
                              order.orderStatus === "Delivered"
                                ? "#ecfdf5"
                                : order.orderStatus === "Pending"
                                ? "#fff7ed"
                                : "#fef2f2",
                            color:
                              order.orderStatus === "Delivered"
                                ? "#047857"
                                : order.orderStatus === "Pending"
                                ? "#c2410c"
                                : "#b91c1c",
                          }}
                        />
                      </Grid>
                    </Grid>

                    {index < stats.recentOrders.length - 1 && (
                      <Divider sx={{ mt: 1 }} />
                    )}
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary" align="center" py={4}>
                  No recent orders yet.
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* ================= LOW STOCK ================= */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                bgcolor: "#fff",
                height: "100%",
                transition: "all 0.2s",
                "&:hover": {
                  boxShadow: "0 10px 20px rgba(0,0,0,0.06)",
                },
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Low Stock Products
              </Typography>

              {stats.lowStockProducts?.length > 0 ? (
                stats.lowStockProducts.map((product) => (
                  <Box
                    key={product._id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1.3,
                      px: 1,
                      borderRadius: 2,
                      transition: "0.2s",
                      "&:hover": { bgcolor: "#f9fafb" },
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "#ef4444",
                        }}
                      />
                      <Typography>{product.name}</Typography>
                    </Box>

                    <Chip
                      label={`${product.countInStock} left`}
                      size="small"
                      sx={{
                        bgcolor: "#fef2f2",
                        color: "#b91c1c",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary" align="center" py={4}>
                  No low stock products 🎉
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;