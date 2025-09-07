import { Router } from "express";
import { verifyJwtTokens } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";
import { USER_ROLES } from "../constant.js";
import {
  quizSubmitValidations,
  quizIdValidation,
} from "../validators/course.validator.js";
import {
  getMyQuizAttempts,
  submitQuizAnswer,
} from "../controllers/quiz.controller.js";

const router = Router();

const { STUDENT } = USER_ROLES;

router.use(verifyJwtTokens);

router
  .route("/:quizId/attempt")
  .post(
    authorizeRole(STUDENT),
    quizIdValidation,
    quizSubmitValidations,
    submitQuizAnswer
  );
router.route("/attempts/me").get(authorizeRole(STUDENT), getMyQuizAttempts);
export default router;
