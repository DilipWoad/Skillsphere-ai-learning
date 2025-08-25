import { Router } from "express";
import { verifyJwtTokens } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";
import {
  enrollInCourse,
  getAllEnrollments,
  getEnrolledStudentInCourse,
  getMyEnrollments,
  markAsComplete,
} from "../controllers/enrollment.controller.js";

import { enrollmentCourseIdValidation } from "../validators/enrollment.validator.js";
import { USER_ROLES } from "../constant.js";

const { ADMIN, STUDENT, INSTRUCTOR } = USER_ROLES;

const router = Router();

router.use(verifyJwtTokens);
router
  .route("/:courseId")
  .post(authorizeRole(STUDENT), enrollmentCourseIdValidation, enrollInCourse)
  .patch(authorizeRole(STUDENT), enrollmentCourseIdValidation, markAsComplete);
router.route("/me").get(authorizeRole(STUDENT), getMyEnrollments);
router.route("/").get(authorizeRole(ADMIN), getAllEnrollments);
router
  .route("/course/:courseId")
  .get(
    authorizeRole(INSTRUCTOR),
    enrollmentCourseIdValidation,
    getEnrolledStudentInCourse
  );
export default router;
