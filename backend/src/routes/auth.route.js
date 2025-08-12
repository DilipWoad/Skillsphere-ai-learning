import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { body } from "express-validator";

const router = Router();

router.route("/register").post(
  [
    body("name", "Name cannot be Empty").notEmpty(),
    body("email", "Enter correct Email address.").isEmail().normalizeEmail(),
    body("password", "Password must be at least 8 characters long.")
      .isLength({ min: 8 })
      .isStrongPassword({
        minSymbols: 1,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
      }),
  ],
  registerUser
);

router.route("/login").post(
  [
    body("email", "Enter correct Email address.").isEmail().normalizeEmail(),
    body("password", "Password must be at least 8 characters long.")
      .isLength({ min: 8 })
      .isStrongPassword({
        minSymbols: 1,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
      }),
  ],
  loginUser
);

export default router;
