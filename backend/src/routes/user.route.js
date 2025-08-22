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
import { USER_ROLES } from "../constant.js";

const { ADMIN, STUDENT, INSTRUCTOR } = USER_ROLES;

const router = Router();

router.use(verifyJwtTokens);
router.route("/me").get(getUserProfile);

router.route("/admin/dashboard").get(authorizeRole(ADMIN), dashboard);

router.route("/").get(authorizeRole(ADMIN), getAllUsers);

router
  .route("/:id")
  .get(authorizeRole(ADMIN), userIdValidation, getUserById)
  .patch(
    authorizeRole(ADMIN),
    userIdValidation,
    updateUserDetailsValidations,
    updateUserDetails
  )
  .delete(authorizeRole(ADMIN), userIdValidation, deleteUser);

export default router;
