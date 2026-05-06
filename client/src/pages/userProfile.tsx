import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/storeHook";
import { fetchMyOrders } from "../store/slices/orderSlice";
import { updateUserDetails } from "../store/slices/userSlice";
import http from "../util/http";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
  Avatar,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import { Person, Edit, ShoppingBag, DeleteForever } from "@mui/icons-material";

const UserProfile = () => {
  const dispatch = useAppDispatch();

  // Auth and Order Data from Redux
  const { userName, email, roles, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );
  const { orders, loading: ordersLoading } = useAppSelector(
    (state) => state.orders,
  );

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string>();
  const [profileData, setProfileData] = useState({
    name: userName || "",
    email: email || "",
  });

  // Sync form if Redux state changes (e.g., after login or update)
  useEffect(() => {
    setProfileData({ name: userName || "", email: email || "" });
  }, [userName, email]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, isAuthenticated]);

  const handleUpdateProfile = async () => {
    // uses the token to identify the user
    try {
      await dispatch(updateUserDetails(profileData)).unwrap();
      setIsEditingProfile(false);
      setUpdateMessage(
        "Profile updated! Please log out and log back in to see changes in the header.",
      );
    } catch (err: any) {
      // because /me does not require UPDATE_USERS permission
      alert(err || "Failed to update profile.");
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await http.patch(`/orders/cancel/${orderId}`);
        dispatch(fetchMyOrders()); // Refresh the list to show "Cancelled" status
      } catch (err) {
        console.error("Failed to cancel order:", err);
        alert("Could not cancel order. It might already be processed.");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Shipped":
        return "primary";
      case "Processing":
        return "warning";
      case "Pending":
        return "info";
      case "Cancelled":
        return "error";
      default:
        return "default";
    }
  };

  if (!isAuthenticated)
    return <Typography sx={{ p: 4 }}>Please log in.</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        My Settings
      </Typography>
      {updateMessage && (
        <Typography color="primary" sx={{ mb: 2, fontWeight: "bold" }}>
          {updateMessage}
        </Typography>
      )}

      <Grid container spacing={4}>
        {/* Profile Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: "center", position: "relative" }}>
            {!isEditingProfile && (
              <IconButton
                onClick={() => setIsEditingProfile(true)}
                sx={{ position: "absolute", top: 10, right: 10 }}
              >
                <Edit fontSize="small" />
              </IconButton>
            )}

            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: "auto",
                mb: 3,
                bgcolor: "primary.main",
              }}
            >
              <Person sx={{ fontSize: 60 }} />
            </Avatar>

            {isEditingProfile ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Name"
                  fullWidth
                  size="small"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                />
                <TextField
                  label="Email"
                  fullWidth
                  size="small"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                />
                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleUpdateProfile}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setIsEditingProfile(false)}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold" }}
                  gutterBottom
                >
                  {userName}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {email}
                </Typography>
              </>
            )}

            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Account Roles
            </Typography>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
              {roles?.map((role: any, i: number) => (
                <Chip
                  key={i}
                  label={typeof role === "string" ? role : role.name}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <ShoppingBag color="primary" />
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                My Orders ({orders.length})
              </Typography>
            </Box>

            {ordersLoading ? (
              <CircularProgress size={24} />
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {orders.map((order) => (
                  <Card key={order._id} variant="outlined">
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Order ID
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold" }}
                          >
                            #{order._id.slice(-8).toUpperCase()}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Chip
                            label={order.status}
                            color={getStatusColor(order.status) as any}
                            size="small"
                          />
                          <Box sx={{ mt: 1 }}>
                            {/* CANCEL BUTTON: Visible only for Pending orders */}
                            {order.status === "Pending" && (
                              <Button
                                size="small"
                                color="error"
                                startIcon={<DeleteForever />}
                                onClick={() => handleCancelOrder(order._id)}
                              ></Button>
                            )}
                          </Box>
                        </Box>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2">
                          Date: {new Date(order.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                          Rs. {order.totalPrice}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfile;
