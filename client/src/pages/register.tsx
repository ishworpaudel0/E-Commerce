import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Link,
  Alert,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks/storeHook";
import { registerUser } from "../store/slices/authSlice";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { type UserRegisterRequest } from "../types";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name is too short"),
    lastName: z.string().min(2, "Last name is too short"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched", // Validates as the user types
  });

  const onSubmit = async (data: RegisterFormData) => {
    const { firstName, lastName, email, password } = data;

    // Construct the payload to match UserRegisterRequest
    const payload: UserRegisterRequest = {
      name: `${firstName} ${lastName}`.trim(),
      email: email.toLowerCase().trim(),
      password,
    };

    const result = await dispatch(registerUser(payload));

    if (registerUser.fulfilled.match(result)) {
      navigate("/login"); // Redirect on success
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Create an Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit, (err) =>
              console.log("Validation Failed:", err),
            )}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              fullWidth
              label="First Name"
              {...register("firstName")}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Last Name"
              {...register("lastName")}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email Address"
              autoComplete="email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Confirm Password"
              type="password"
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || isSubmitting}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Register"
              )}
            </Button>
            <Box sx={{ textAlign: "center" }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
