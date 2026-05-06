import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Divider,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";

interface FooterProps {
  mode: "light" | "dark";
  toggleTheme: () => void;
}

const Footer = ({ mode, toggleTheme }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        // Uses theme-aware colors for better transition
        backgroundColor: theme.palette.mode === "light" ? "#f5f5f5" : "#121212",
        mt: 8,
        pt: 6,
        pb: 3,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Electronic Store
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Your one-stop destination for premium electronics and gadgets with
              quality assurance and best prices.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
              >
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                href="https://www.x.com"
                target="_blank" 
                color="primary">
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                href="https://www.instagram.com" 
                target="_blank" 
                color="primary">
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                href="https://www.linkedin.com" 
                target="_blank" 
                color="primary">
                <LinkedIn fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links to Pages in App*/}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                component={Link}
                to="/"
                color="inherit"
                sx={{ justifyContent: "flex-start", textTransform: "none" }}
              >
                Home
              </Button>
              <Button
                component={Link}
                to="/about"
                color="inherit"
                sx={{ justifyContent: "flex-start", textTransform: "none" }}
              >
                About Us
              </Button>
              <Button
                component={Link}
                to="/contact"
                color="inherit"
                sx={{ justifyContent: "flex-start", textTransform: "none" }}
              >
                Contact Us
              </Button>
              <Button
                component={Link}
                to="/cart"
                color="inherit"
                sx={{ justifyContent: "flex-start", textTransform: "none" }}
              >
                Cart
              </Button>
            </Box>
          </Grid>

          {/* Customer Support */}
          <Grid item xs={12} sm={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Customer Support
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email fontSize="small" color="primary" />
                <Typography variant="body2">support@estore.com</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone fontSize="small" color="primary" />
                <Typography variant="body2">+977-1-5555555</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <LocationOn fontSize="small" color="primary" sx={{ mt: 0.5 }} />
                <Typography variant="body2">Kathmandu, Nepal</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Bottom Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            &copy; {currentYear} Electronic Store. All rights reserved.
          </Typography>

          {/* Dark Mode Toggle Icon */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {mode === "dark" ? "Light Mode" : "Dark Mode"}
            </Typography>
            <IconButton onClick={toggleTheme} color="inherit">
              {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", gap: 3 }}>
            <Button color="inherit" size="small" sx={{ textTransform: "none" }}>
              Privacy Policy
            </Button>
            <Button color="inherit" size="small" sx={{ textTransform: "none" }}>
              Terms of Service
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
