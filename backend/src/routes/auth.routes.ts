import { Router } from "express";
import {
  signup,
  login,
  refresh,
  logout,
  getMe,
  signupSchema,
  loginSchema,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// Protected routes
router.get("/me", authenticate, getMe);

export default router;
