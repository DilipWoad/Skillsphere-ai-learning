import { Router } from "express";
import { verifyJwtTokens } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";
import { USER_ROLES } from "../constant.js";
import {
  quizSubmitValidations,
  quizIdValidation,
  lessonIdValidation,
} from "../validators/course.validator.js";
import {
  getLatestQuizResult,
  getMyLessonQuizAttempts,
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

router
  .route("/:lessonId/attempts/me")
  .get(authorizeRole(STUDENT), lessonIdValidation, getMyLessonQuizAttempts);

router
  .route("/:lessonId/result/latest")
  .get(authorizeRole(STUDENT), lessonIdValidation, getLatestQuizResult);
export default router;
