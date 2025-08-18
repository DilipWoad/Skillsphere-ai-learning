import { Router } from "express";
import { verifyJwtTokens } from "../middlewares/authMiddleware.js";
import {
  dashboard,
  getAllUsers,
  getUserById,
  getUserProfile,
} from "../controllers/user.controller.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";

import { param } from "express-validator";

const router = Router();

router.use(verifyJwtTokens);
router.route("/me").get(getUserProfile);

router.route("/admin/dashboard").get(authorizeRole("admin"), dashboard);

router.route("/").get(authorizeRole("admin"), getAllUsers);

router
  .route("/:id")
  .get(
    param("id").isMongoId().withMessage("Invalid user Id"),
    authorizeRole("admin"),
    getUserById
  );
export default router;
