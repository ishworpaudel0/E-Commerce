import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks/storeHook";
import { fetchProducts } from "../store/slices/productSlice";
import { fetchCategories } from "../store/slices/categorySlice";
import {
  Box,
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Pagination,
  CircularProgress,
  InputAdornment,
  Chip,
  TextField,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Home = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, roles } = useAppSelector((state) => state.auth);
  const { products, totalProducts, loading } = useAppSelector(
    (state) => state.product,
  );
  const { categories } = useAppSelector((state) => state.category);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const limit = 8;

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch products when page, search, or category changes
  useEffect(() => {
    dispatch(
      fetchProducts({
        page,
        limit,
        search: searchTerm,
        category: selectedCategory || undefined,
      }),
    );
  }, [dispatch, page, searchTerm, selectedCategory]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setPage(1); // Reset to first page when changing category
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Auth & Role Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
          Electronic Store
        </Typography>

        <Typography
          color={isAuthenticated ? "success.main" : "text.secondary"}
          sx={{ fontWeight: 500 }}
        >
          {isAuthenticated
            ? "✓ Authenticated"
            : "Welcome Guest! Please Log In to Shop"}
        </Typography>

        {isAuthenticated && roles.length > 0 && (
          <Box
            sx={{
              mt: 1,
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {roles.map((r, i) => (
              <Chip
                key={i}
                label={typeof r === "string" ? r : (r as any).name}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Search Input */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
        <TextField
          variant="outlined"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: { xs: "100%", md: "60%" } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Category Filter Section */}
      <Box sx={{ mb: 6, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 2 }}>
        <Button
          variant={selectedCategory === null ? "contained" : "outlined"}
          onClick={() => handleCategoryClick(null)}
          size="small"
        >
          All Products
        </Button>
        {categories.map((category) => (
          <Button
            key={category._id}
            variant={selectedCategory === category._id ? "contained" : "outlined"}
            onClick={() => handleCategoryClick(category._id)}
            size="small"
          >
            {category.name}
          </Button>
        ))}
      </Box>

      {/* Product List Section */}
      {loading && products.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: "center",
            }}
          >
            {products.map((product) => (
              <Card
                key={product._id}
                onClick={() => navigate(`/product/${product.slug}`)}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 24px)",
                    md: "calc(25% - 24px)",
                  },
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: 4 },
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={product.images[0] || "https://via.placeholder.com/300"}
                  alt={product.name}
                  sx={{ objectFit: "contain", p: 2 }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="subtitle2"
                    color="primary"
                    sx={{ fontWeight: "bold" }}
                  >
                    {product.brand}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="h6"
                    noWrap
                    sx={{ fontWeight: 600 }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: "#2e7d32", fontWeight: 700 }}
                  >
                    Rs. {product.price.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}

          {products.length === 0 && !loading && (
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              sx={{ mt: 10 }}
            >
              No products found
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory && " in this category"}
            </Typography>
          )}
        </>
      )}
    </Container>
  );
};

export default Home;
