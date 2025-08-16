import { Router } from "express";
import { feedVid, loginUser,logoutUser, refreshTokens, registerUser } from "../controllers/auth.controller.js";
import { body } from "express-validator";
import { verifyJwtTokens } from "../middlewares/authMiddleware.js";

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

router.route("/").get(verifyJwtTokens,feedVid)

router.route("/logout").post(verifyJwtTokens,logoutUser)

router.route("/refresh-token").post(refreshTokens);
export default router;
