import {
  Grid,
  Paper,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Chip,
  Container,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/admin/adminDashboardService";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
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
    {
      title: "Revenue",
      value: `₹${stats?.totalSales ?? 0}`,
      icon: <CurrencyRupeeIcon fontSize="large" />,
      color: "#6366F1",
    },
    {
      title: "Orders",
      value: stats?.totalOrders ?? 0,
      icon: <ShoppingCartIcon fontSize="large" />,
      color: "#10B981",
    },
    {
      title: "Users",
      value: stats?.totalUsers ?? 0,
      icon: <PeopleIcon fontSize="large" />,
      color: "#F59E0B",
    },
    {
      title: "Low Stock",
      value: stats?.lowStockProducts?.length ?? 0,
      icon: <InventoryIcon fontSize="large" />,
      color: "#EF4444",
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, md: 3 } }}>
      {/* KPI Cards - 4-column on md+, 2 on sm, 1 on xs */}
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {kpiCards.map((card) => (
          <Grid item size={{ xs: 2, sm: 3, md: 3 }} key={card.title}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "background.paper",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {card.value}
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: card.color,
                  color: "white",
                  borderRadius: "50%",
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                }}
              >
                {card.icon}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Main Content - Recent Orders + Low Stock */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: 2 }}>
        {/* Recent Orders - takes more space */}
        <Grid item size={{ xs: 12, sm: 6, md: 6 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Recent Orders
            </Typography>

            {stats.recentOrders?.length > 0 ? (
              stats.recentOrders.map((order, index) => (
                <Box key={order._id}>
                  <Grid container alignItems="center" sx={{ py: 2 }}>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {order.user?.name || "Guest"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        #{order._id.slice(-6)} • {order.shippingAddress?.city || "N/A"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.orderItems?.length || 0} items • {order.paymentMethod}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4} sx={{ textAlign: { xs: "left", sm: "right" }, mt: { xs: 1, sm: 0 } }}>
                      <Typography variant="h6" fontWeight={700}>
                        ₹{order.totalPrice}
                      </Typography>
                      <Chip
                        size="small"
                        label={order.orderStatus}
                        color={
                          order.orderStatus === "Delivered" ? "success" :
                          order.orderStatus === "Pending" ? "warning" :
                          order.orderStatus === "Cancelled" ? "error" : "default"
                        }
                        sx={{ mt: 0.5 }}
                      />
                    </Grid>
                  </Grid>

                  {index < stats.recentOrders.length - 1 && <Divider />}
                </Box>
              ))
            ) : (
              <Typography color="text.secondary" align="center" py={4}>
                No recent orders yet.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Low Stock - sidebar style */}
        <Grid item size={{ xs: 12, sm: 6, md: 6 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
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
                    py: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    "&:last-child": { borderBottom: 0 },
                  }}
                >
                  <Typography variant="body1">{product.name}</Typography>
                  <Chip
                    label={`${product.countInStock} left`}
                    size="small"
                    color="error"
                  />
                </Box>
              ))
            ) : (
              <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
                <Typography>No low stock products 🎉</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;