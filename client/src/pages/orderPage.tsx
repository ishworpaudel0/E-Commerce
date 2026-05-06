// src/pages/Orders.tsx
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/storeHook";
import { fetchMyOrders } from "../store/slices/orderSlice";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";

const Orders = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Shipped":
        return "primary";
      case "Processing":
        return "warning";
      case "Cancelled":
        return "error";
      default:
        return "default";
    }
  };

  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 6 }} />;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        My Orders
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 3 }}>
          {error}
        </Typography>
      )}

      {orders.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
          You haven't placed any orders yet.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {orders.map((order) => (
            <Card key={order._id} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </Typography>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status) as any}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Placed on: {new Date(order.createdAt).toLocaleDateString()}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {order.orderItems.map((item, index) => (
                  <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Qty: {item.quantity} × Rs. {item.price}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </Typography>
                  </Box>
                ))}

                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">Total</Typography>
                  <Typography
                    variant="h5"
                    color="success.main"
                    sx={{ fontWeight: "bold" }}
                  >
                    Rs. {order.totalPrice.toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Orders;
