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

import { param, body } from "express-validator";
const allowedRoles = ["admin", "student", "instructor"];

const router = Router();

router.use(verifyJwtTokens);
router.route("/me").get(getUserProfile);

router.route("/admin/dashboard").get(authorizeRole("admin"), dashboard);

router.route("/").get(authorizeRole("admin"), getAllUsers);

router
  .route("/:id")
  .get(
    authorizeRole("admin"),
    param("id").isMongoId().withMessage("Invalid user Id"),
    getUserById
  )
  .patch(
    authorizeRole("admin"),
    param("id").isMongoId().withMessage("Invalid user Id"),
    [
      body("name").notEmpty().withMessage("Name cannot be Empty"),
      body("role")
        .notEmpty()
        .withMessage("Role is Required")
        .isIn(allowedRoles)
        .withMessage(`Role must be one of: ${allowedRoles.join(", ")}`),
    ],
    updateUserDetails
  )
  .delete(
    authorizeRole("admin"),
    param("id").isMongoId().withMessage("Invalid user Id"),
    deleteUser
  );

export default router;
