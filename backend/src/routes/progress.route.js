import { Router } from "express";
import { verifyJwtTokens } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";
import { USER_ROLES } from "../constant.js";
import {
  courseIdValidation,
  lessonIdValidation,
} from "../validators/course.validator.js";
import {
  getProgressByCourse,
  instructorGetStudentProgress,
  markLessonComplete,
} from "../controllers/progress.controller.js";

const router = Router();

router.use(verifyJwtTokens);
const { STUDENT, INSTRUCTOR } = USER_ROLES;
router
  .route("/:id/:lessonId/complete")
  .post(
    authorizeRole(STUDENT),
    courseIdValidation,
    lessonIdValidation,
    markLessonComplete
  );

router
  .route("/:id")
  .get(authorizeRole(STUDENT), courseIdValidation, getProgressByCourse);
router
  .route("/:id/students")
  .get(
    authorizeRole(INSTRUCTOR),
    courseIdValidation,
    instructorGetStudentProgress
  );
export default router;
