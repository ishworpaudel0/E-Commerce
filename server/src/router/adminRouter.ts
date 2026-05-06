import { Router } from "express";
import * as adminController from "../controllers/adminController";
import { authenticate } from "../middlewares/userMiddleware";
import { authorizeWithPermission } from "../middlewares/permissionMiddleware";

const router = Router();

// Protect all admin routes
// Use the exact property name 'permission' as defined in your interface.
router.use(authenticate, authorizeWithPermission({ permission: 'VIEW_ADMIN_DASHBOARD' }));

router.get("/stats", adminController.getStats);
router.get("/orders", adminController.getOrders);

export default router;