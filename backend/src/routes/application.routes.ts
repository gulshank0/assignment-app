import { Router } from "express";
import {
  createApplication,
  listApplications,
  getApplication,
  updateApplication,
  deleteApplication,
  createApplicationSchema,
  updateApplicationSchema,
} from "../controllers/application.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

// All application routes require authentication
router.use(authenticate);

router.get("/", listApplications);
router.post("/", validate(createApplicationSchema), createApplication);
router.get("/:id", getApplication);
router.patch("/:id", validate(updateApplicationSchema), updateApplication);
router.delete("/:id", deleteApplication);

export default router;
