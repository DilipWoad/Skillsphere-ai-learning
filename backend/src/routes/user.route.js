import { Router } from "express";
import { verifyJwtTokens } from "../middlewares/authMiddleware.js";
import { dashboard, getUserProfile } from "../controllers/user.controller.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";

const router = Router();

router.route("/me").get(verifyJwtTokens, getUserProfile);

router
  .route("/admin/dashboard")
  .get(verifyJwtTokens, authorizeRole("admin"), dashboard);

export default router;
