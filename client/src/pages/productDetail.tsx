import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/storeHook";
import { fetchProductBySlug } from "../store/slices/productSlice";
import { fetchProductReviews, addReview } from "../store/slices/reviewSlice";
import { addItemToCart } from "../store/slices/cartSlice";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Button,
  Paper,
  Rating,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Alert,
} from "@mui/material";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux Selectors
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { selectedProduct, loading, error } = useAppSelector(
    (state) => state.product,
  );
  const { reviews, loading: reviewsLoading } = useAppSelector(
    (state) => state.reviews,
  );

  // Local Form State for Reviews
  const [rating, setRating] = useState<number | null>(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
    }
  }, [slug, dispatch]);

  useEffect(() => {
    if (selectedProduct?._id) {
      dispatch(fetchProductReviews(selectedProduct._id));
    }
  }, [selectedProduct?._id, dispatch]);

  // Handlers
  const handleAddToCart = async () => {
    if (!selectedProduct) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await dispatch(
        addItemToCart({ productId: selectedProduct._id, quantity: 1 }),
      ).unwrap();
      navigate("/cart");
    } catch (err) {
      console.error("Cart Error:", err);
    }
  };
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct?._id || !rating) return;

    try {
      await dispatch(
        addReview({
          productId: selectedProduct._id,
          rating,
          comment,
        }),
      ).unwrap();
      setComment("");
      setRating(5);

      dispatch(fetchProductBySlug(slug as string));
    } catch (err: any) {
      if (err.status === 401) {
        navigate("/login");
      }
    }
  };

  if (loading)
    return <CircularProgress sx={{ display: "block", m: "auto", mt: 10 }} />;
  if (error)
    return (
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        {error}
      </Typography>
    );
  if (!selectedProduct) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          mb: 8,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 4 }}>
            <img
              src={selectedProduct.images[0] || "placeholder.jpg"}
              alt={selectedProduct.name}
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
          </Paper>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" color="primary">
            {selectedProduct.brand}
          </Typography>
          <Typography variant="h3" gutterBottom>
            {selectedProduct.name}
          </Typography>

          <Stack direction="row" spacing={1}  sx={{ mb: 2, alignItems:"center"}}>
            <Rating
              value={selectedProduct.averageRating || 0}
              precision={0.5}
              readOnly
            />
            <Typography variant="body2" color="text.secondary">
              ({selectedProduct.numReviews || 0} reviews)
            </Typography>
          </Stack>

          <Typography variant="h4" color="success.main" sx={{ mb: 2 }}>
            Rs. {selectedProduct.price.toLocaleString()}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, whiteSpace: "pre-wrap" }}>
            {selectedProduct.description}
          </Typography>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleAddToCart}
            disabled={selectedProduct.stock === 0}
          >
            {selectedProduct.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 6 }} />

      {/* Reviews Section */}
      <Box sx={{ maxWidth: "800px" }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          Customer Reviews
        </Typography>

        {isAuthenticated ? (
          <Paper sx={{ p: 3, mb: 6, bgcolor: "#fafafa" }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Share your thoughts
            </Typography>
            <form onSubmit={handleReviewSubmit}>
              <Box sx={{ mb: 2 }}>
                <Typography component="legend" variant="body2">
                  Rating
                </Typography>
                <Rating value={rating} onChange={(_, val) => setRating(val)} />
              </Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Write your comment here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                sx={{ mb: 2, bgcolor: "white" }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={comment.length < 5}
              >
                Post Review
              </Button>
            </form>
          </Paper>
        ) : (
          <Alert severity="info" sx={{ mb: 4 }}>
            Please login to write a review.
          </Alert>
        )}

        {/* Reviews List */}
        <List sx={{ width: "100%" }}>
          {reviews.map((rev: any) => (
            <Paper key={rev._id} sx={{ mb: 2, p: 2 }} variant="outlined">
              <ListItem alignItems="flex-start" disableGutters>
                <ListItemText
                  primary={
                    <Stack
                      direction="row"
                      sx={{alignItems:"center", justifyContent:"space-between"}}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        {rev.user?.name}
                      </Typography>
                      <Rating value={rev.rating} readOnly size="small" />
                    </Stack>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        sx={{ mb: 0.5 }}
                      >
                        {rev.comment}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </Paper>
          ))}
          {reviews.length === 0 && !reviewsLoading && (
            <Typography color="text.secondary">
              No reviews yet. Be the first to review this product!
            </Typography>
          )}
        </List>
      </Box>
    </Container>
  );
};

export default ProductDetail;
