import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/storeHook";
import {
  Button,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
} from "@mui/material";
import { AdminPanelSettings, Person } from "@mui/icons-material";
import { clearAuth, logoutUser } from "../store/slices/authSlice";
import { ShoppingCart } from "@mui/icons-material";
import { Badge, IconButton } from "@mui/material";
import { getRefreshToken } from "../util/tokens";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, roles, userName, refreshToken } = useAppSelector(
    (state) => state.auth,
  );
  const { items } = useAppSelector((state) => state.cart);
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    // Get the token directly from the utility to be safe
    const token = refreshToken || getRefreshToken();

    if (token) {
      await dispatch(logoutUser({ refreshToken: token }));
    } else {
      dispatch(clearAuth());
    }
    navigate("/login");
  };

  const isAdmin = roles.some((role) => {
    const roleName = typeof role === "string" ? role : (role as any).name;
    return roleName === "Admin" || roleName === "Super_Admin";
  });

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Electronic Store
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button component={Link} to="/">
            Store
          </Button>
          <Button component={Link} to="/about">
            About Us
          </Button>
          <Button component={Link} to="/contact">
            Contact Us
          </Button>
          <IconButton component={Link} to="/cart" color="inherit">
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {isAuthenticated && isAdmin && (
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/admin/dashboard"
              startIcon={<AdminPanelSettings />}
            >
              Admin Dashboard
            </Button>
          )}

          {isAuthenticated && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                ml: 2,
                cursor: "pointer",
                "&:hover": { opacity: 0.8 },
              }}
              onClick={() => navigate("/profile")}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                <Person fontSize="small" />
              </Avatar>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {userName}
              </Typography>
            </Box>
          )}

          {isAuthenticated ? (
            <Button onClick={handleLogout} color="error">
              Logout
            </Button>
          ) : (
            <Button component={Link} to="/login">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;
