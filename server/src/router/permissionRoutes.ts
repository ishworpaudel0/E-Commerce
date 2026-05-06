import { Router } from "express";
import * as permissionController from "../controllers/permissionController";
import { authenticate } from "../middlewares/userMiddleware";
import { authorizeWithPermission } from "../middlewares/permissionMiddleware";
import appPermissions from "../constant/permission";

const router = Router();

router.use(authenticate); // Since all route has to be authenticated to be used.

router.post(
  "/",
  authorizeWithPermission({
    permission: appPermissions.CREATE_PERMISSIONS.name,
  }),
  permissionController.createPermission,
);

router.get(
  "/",
  authorizeWithPermission({ permission: appPermissions.VIEW_PERMISSIONS.name }),
  permissionController.getAllPermissions,
);

export default router;
