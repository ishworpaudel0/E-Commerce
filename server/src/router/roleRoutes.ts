import { Router } from "express";
import * as roleController from "../controllers/roleController";
import { authenticate } from "../middlewares/userMiddleware";
import { authorizeWithPermission } from "../middlewares/permissionMiddleware";
import { validateRequestBody } from "../middlewares/validatorMiddleware";
import { createRolesSchema, updateRolesSchema } from "../schema/roleSchema";
import appPermissions from "../constant/permission";

const router = Router();

router.use(authenticate); // it makes sure every route uses authenticate since every route has to be logged in to use

router.post(
  "/",
  authorizeWithPermission({ permission: appPermissions.CREATE_ROLES.name }),
  validateRequestBody(createRolesSchema),
  roleController.createRole,
);

router.get(
  "/",
  authorizeWithPermission({ permission: appPermissions.VIEW_ROLES.name }),
  roleController.getAllRoles,
);

router.patch(
  "/:id",
  authorizeWithPermission({ permission: appPermissions.UPDATE_ROLES.name }),
  validateRequestBody(updateRolesSchema),
  roleController.updateRole,
);

router.delete(
  "/:id",
  authorizeWithPermission({ permission: appPermissions.DELETE_ROLES.name }),
  roleController.deleteRole,
);

export default router;
