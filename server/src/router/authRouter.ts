import { Router } from "express";
import * as authController from "../controllers/authController";
import { validateRequestBody } from "../middlewares/validatorMiddleware";
import { createUser, loginSchema } from "../schema/authSchema";

const router = Router();

router.post(
  "/register",
  validateRequestBody(createUser),
  authController.register,
);
router.post("/login", validateRequestBody(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);

export default router;
