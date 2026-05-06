// This is only mock and is not useful.
import { Router } from "express";
import * as paymentController from "../controllers/paymentController";
import { authenticate } from "../middlewares/userMiddleware";

const router = Router();

// Endpoint to get the signature before redirecting to eSewa
router.get(
  "/initiate-esewa/:orderId",
  authenticate,
  paymentController.initiateEsewaPayment,
);

router.get(
  "/verify-payment",
  authenticate,
  paymentController.verifyEsewaPayment,
);

export default router;
