import { Router } from "express";
import * as reviewController from "../controllers/reviewController";
import { authenticate } from "../middlewares/userMiddleware";
import { validateRequestBody } from "../middlewares/validatorMiddleware";
import { createReviewSchema } from "../schema/reviewSchema";
import { createReview } from "../controllers/reviewController";

const router = Router();

//Anyone can read reviews for a product
router.get("/:productId", reviewController.getProductReviews);

//Only logged-in users can write a review
router.post(
  "/:productId",
  authenticate,
  validateRequestBody(createReviewSchema),
  createReview,
);

export default router;
