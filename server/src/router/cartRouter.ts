import { Router } from "express";
import * as cartController from "../controllers/cartController";
import { authenticate } from "../middlewares/userMiddleware";
import { addToCartSchema } from "../schema/cartSchema";
import { validateRequestBody } from "../middlewares/validatorMiddleware";

const router = Router();

router.use(authenticate); // All cart routes require login

router.get("/", cartController.getUserCart);
router.post(
  "/add",
  validateRequestBody(addToCartSchema),
  cartController.addItemToCart,
);
// Remove a specific item
router.delete("/remove/:productId", cartController.removeItem);

// Clear the entire cart
//Not used in front end side
router.delete("/clear", cartController.clearUserCart);

export default router;
