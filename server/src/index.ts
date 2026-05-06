import express from "express";
import cors from "cors";
import { config } from "./config";
import connectDB from "./configuration/db";
import router from "./router/indexRoutes";
import { globalErrorHandler } from "./middlewares/errorMiddleware";

const app = express();
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// Router must be before the error handler
app.use("/api", router);

// Global error hangler (middleware) to catch errors.
app.use(globalErrorHandler);

// Starting Server.
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
