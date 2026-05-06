import { Router } from "express";
import * as orderController from "../controllers/orderController";
import { authenticate } from "../middlewares/userMiddleware";
import { validateRequestBody } from "../middlewares/validatorMiddleware";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../schema/orderSchema";
import { authorizeWithPermission } from "../middlewares/permissionMiddleware";
import appPermissions from "../constant/permission";

const router = Router();

// All order oroutes require a logged-in user
router.use(authenticate);

// User Routes
router.post(
  "/",
  validateRequestBody(createOrderSchema),
  orderController.createOrder,
);

router.get("/my-orders", orderController.getMyOrders);

// Users can cancel their own pending orders and Admins can cancel any
router.patch("/cancel/:orderId", orderController.cancelUserOrder);

// Admin Only Routes
router.patch(
  "/status/:orderId",
  authorizeWithPermission({ permission: appPermissions.MANAGE_ORDERS.name }),
  validateRequestBody(updateOrderStatusSchema),
  orderController.updateOrderStatus,
);
router.get(
  "/admin/all",
  authorizeWithPermission({ permission: appPermissions.MANAGE_ORDERS.name }),
  orderController.getAllOrders,
);

export default router;
