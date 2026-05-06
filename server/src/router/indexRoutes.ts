import { Router } from "express";
import authRouter from "./authRouter";
import roleRouter from "./roleRoutes";
import permissionRouter from "./permissionRoutes";
import userRouter from "./userRoutes";
import categoryRouter from "./categoryRoutes";
import productRouter from "./productRouter";
import reviewRouter from "./reviewRouter";
import cartRouter from "./cartRouter";
import orderRouter from "./orderRouter";

const router = Router();

router.use("/auth", authRouter);
router.use("/roles", roleRouter);
router.use("/permissions", permissionRouter);
router.use("/users", userRouter);
router.use("/categories", categoryRouter);
router.use("/products", productRouter);
router.use("/reviews", reviewRouter);
router.use("/cart", cartRouter);
router.use("/orders", orderRouter);

export default router;
