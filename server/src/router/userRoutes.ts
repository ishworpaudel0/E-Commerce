import { Router } from "express";
import * as userController from "../controllers/userController";
import { authenticate } from "../middlewares/userMiddleware";
import { authorizeWithPermission } from "../middlewares/permissionMiddleware";
import appPermissions from "../constant/permission";

const router = Router();
//routes for user so we only need authenticate
router.get("/me", authenticate, userController.getMe);
router.patch("/me", authenticate, userController.updateMe);
router.patch("/change-password", authenticate, userController.changePassword);

// Routes for managing users for admin ad super_admin
router.get(
  "/",
  authenticate,
  authorizeWithPermission({ permission: appPermissions.VIEW_USERS.name }),
  userController.getAllUsers,
);
router.get(
  "/:id",
  authenticate,
  authorizeWithPermission({ permission: appPermissions.VIEW_USERS.name }),
  userController.getUserById,
);
router.patch(
  "/:id",
  authenticate,
  authorizeWithPermission({ permission: appPermissions.UPDATE_USERS.name }),
  userController.updateUser,
);
router.delete(
  "/:id",
  authenticate,
  authorizeWithPermission({ permission: appPermissions.DELETE_USERS.name }),
  userController.deleteUser,
);
router.patch(
  "/:id/roles",
  authenticate,
  authorizeWithPermission({ permission: appPermissions.UPDATE_USERS.name }),
  userController.updateUserRoles,
);

export default router;
