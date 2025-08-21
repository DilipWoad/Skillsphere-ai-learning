import { Router } from "express";
import {
  feedVid,
  loginUser,
  logoutUser,
  refreshTokens,
  registerUser,
} from "../controllers/auth.controller.js";
import { verifyJwtTokens } from "../middlewares/authMiddleware.js";
import {
  loginValidations,
  registerValidations,
} from "../validators/auth.validator.js";

const router = Router();

router.route("/register").post(registerValidations, registerUser);

router.route("/login").post(loginValidations, loginUser);

router.route("/").get(verifyJwtTokens, feedVid);

router.route("/logout").post(verifyJwtTokens, logoutUser);

router.route("/refresh-token").post(refreshTokens);
export default router;
