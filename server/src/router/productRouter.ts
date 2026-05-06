import { Router } from "express";
import * as productController from "../controllers/productController";
import { authenticate } from "../middlewares/userMiddleware";
import { authorizeWithPermission } from "../middlewares/permissionMiddleware";
import { validateRequestBody } from "../middlewares/validatorMiddleware";
import { createProductSchema } from "../schema/productSchema";
import appPermissions from "../constant/permission";
import { upload } from "../middlewares/uploadMiddleware";
import { updateProductSchema } from "../schema/productSchema";

const router = Router();

//public route
router.get("/", productController.getAllProducts);

router.post(
  "/",
  authenticate,
  authorizeWithPermission({ permission: appPermissions.MANAGE_PRODUCTS.name }), // Only Aadmin and above can use route
  upload.array("images", 5),
  validateRequestBody(createProductSchema),
  productController.createProduct,
);

router.patch(
  "/:id",
  authenticate,
  authorizeWithPermission({ permission: appPermissions.MANAGE_PRODUCTS.name }),
  upload.none(), // Used multer's none() to ensure req.body is populated without file handling
  validateRequestBody(updateProductSchema), // Use the
  productController.updateProduct,
);
// to get detail product page by slug (slug converts into human readable language)
//makes easy for search and getting specific product
router.get("/:slug", productController.getProductBySlug);
export default router;
