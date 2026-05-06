import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import { fetchAllOrders } from "../../store/slices/orderSlice";
import { fetchProducts } from "../../store/slices/productSlice";
import { fetchAllUsers } from "../../store/slices/userSlice";
import { Box, Typography, Paper, Grid, CircularProgress } from "@mui/material";
import {
  People,
  Inventory,
  ShoppingCart,
  AttachMoney,
} from "@mui/icons-material";

const AdminDashboard = () => {
  const dispatch = useAppDispatch();

  const { allOrders, loading: ordersLoading } = useAppSelector(
    (state) => state.orders,
  );
  const { products, loading: productsLoading } = useAppSelector(
    (state) => state.product,
  );
  const { users, loading: usersLoading } = useAppSelector(
    (state) => state.user,
  );

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchProducts({ limit: 100 }));
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const totalRevenue = allOrders
    .filter((order) => order.status === "Delivered")
    .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  const totalUsers = users.length;
  const totalProducts = products.length;
  const totalOrders = allOrders.length;

  const stats = [
    {
      label: "Total Users",
      value: totalUsers.toString(),
      icon: <People color="primary" />,
      bgColor: "#1976D2",
    },
    {
      label: "Products",
      value: totalProducts.toString(),
      icon: <Inventory color="secondary" />,
      bgColor: "#1976D2",
    },
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      icon: <ShoppingCart color="success" />,
      bgColor: "#1976D2",
    },
    {
      label: "Revenue (Delivered)",
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      icon: <AttachMoney color="warning" />,
      bgColor: "#1976D2",
    },
  ];

  const isLoading = ordersLoading || productsLoading || usersLoading;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Dashboard Overview
      </Typography>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: stat.bgColor,
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    mr: 3,
                    display: "flex",
                    p: 1.5,
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    {stat.label}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mt: 0.5 }}>
                    {stat.value}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          Recent Orders
        </Typography>

        <Paper sx={{ p: 3 }}>
          {allOrders.length > 0 ? (
            allOrders.slice(0, 5).map((order) => (
              <Box
                key={order._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 2,
                  borderBottom: "1px solid #eee",
                  "&:last-child": { borderBottom: "none" },
                }}
              >
                <Box>
                  <Typography 
                    variant="body1" 
                    sx={{fontWeight: "medium"}}>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.user &&
                    typeof order.user === "object" &&
                    order.user.name
                      ? order.user.name
                      : "Unknown Customer"}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    variant="body1"
                    sx= {{fontWeight:"bold", color:"success.main"}}
                  >
                    Rs. {order.totalPrice?.toLocaleString() || "0"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
              No orders yet
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
