import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import {
  fetchAllOrders,
  updateOrderStatus,
} from "../../store/slices/orderSlice";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";

const AdminOrders = () => {
  const dispatch = useAppDispatch();
  const { allOrders, loading } = useAppSelector((state) => state.orders);

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await dispatch(
        updateOrderStatus({ orderId, status: newStatus }),
      ).unwrap();
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRefresh = () => {
    dispatch(fetchAllOrders());
  };

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

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Order Management
        </Typography>
        <Tooltip title="Refresh Orders">
          <IconButton onClick={handleRefresh} disabled={loading}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976D2" }}>
            <TableRow>
              <TableCell>
                <strong>Order ID</strong>
              </TableCell>
              <TableCell>
                <strong>Customer</strong>
              </TableCell>
              <TableCell>
                <strong>Total Amount</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Placed On</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Update Status</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allOrders.map((order) => (
              <TableRow key={order._id} hover>
                <TableCell>
                  <strong>#{order._id.slice(-8).toUpperCase()}</strong>
                </TableCell>
                <TableCell>
                  {order.user &&
                  typeof order.user === "object" &&
                  order.user.name
                    ? order.user.name
                    : "Unknown Customer"}
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body1"
                    color="success.main"
                    sx={{ fontWeight: "bold" }}
                  >
                    Rs. {order.totalPrice?.toLocaleString() || "0"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell align="center">
                  <FormControl size="small" sx={{ minWidth: 160 }}>
                    <Select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value as string)
                      }
                      disabled={updatingId === order._id}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Processing">Processing</MenuItem>
                      <MenuItem value="Shipped">Shipped</MenuItem>
                      <MenuItem value="Delivered">Delivered</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {loading && (
        <CircularProgress sx={{ mt: 3, display: "block", mx: "auto" }} />
      )}

      {allOrders.length === 0 && !loading && (
        <Paper sx={{ p: 5, textAlign: "center", mt: 3 }}>
          <Typography variant="h6" color="text.secondary">
            No orders found
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default AdminOrders;
