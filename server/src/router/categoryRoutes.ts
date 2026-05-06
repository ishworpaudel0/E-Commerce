import { Router } from "express";
import * as categoryController from "../controllers/categoryController";
import { authenticate } from "../middlewares/userMiddleware";
import { authorizeWithPermission } from "../middlewares/permissionMiddleware";
import { validateRequestBody } from "../middlewares/validatorMiddleware";
import { createCategorySchema } from "../schema/categorySchema";
import appPermissions from "../constant/permission";

const router = Router();

router.use(authenticate);

//Only Admin and above can create Category.
router.post(
  "/",
  authorizeWithPermission({
    permission: appPermissions.CATEGORY_MANAGEMENT.name,
  }),
  validateRequestBody(createCategorySchema),
  categoryController.createCategory,
);

router.get("/", categoryController.getCategories);

export default router;
