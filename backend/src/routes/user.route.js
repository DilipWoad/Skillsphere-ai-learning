import { Router } from "express";
import { verifyJwtTokens } from "../middlewares/authMiddleware.js";
import {
  dashboard,
  deleteUser,
  getAllUsers,
  getUserById,
  getUserProfile,
  updateUserDetails,
} from "../controllers/user.controller.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";

import {
  updateUserDetailsValidations,
  userIdValidation,
} from "../validators/user.validator.js";

const router = Router();

router.use(verifyJwtTokens);
router.route("/me").get(getUserProfile);

router.route("/admin/dashboard").get(authorizeRole("admin"), dashboard);

router.route("/").get(authorizeRole("admin"), getAllUsers);

router
  .route("/:id")
  .get(authorizeRole("admin"), userIdValidation, getUserById)
  .patch(
    authorizeRole("admin"),
    userIdValidation,
    updateUserDetailsValidations,
    updateUserDetails
  )
  .delete(authorizeRole("admin"), userIdValidation, deleteUser);

export default router;
