import { Router } from "express";
import { verifyJwtTokens } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";
import {
  enrollInCourse,
  getAllEnrollments,
  getMyEnrollments,
  markAsComplete,
} from "../controllers/enrollment.controller.js";

import { enrollmentCourseIdValidation } from "../validators/enrollment.validator.js";

const router = Router();

router.use(verifyJwtTokens);
router
  .route("/:courseId")
  .post(authorizeRole("student"), enrollmentCourseIdValidation, enrollInCourse)
  .patch(authorizeRole("student"), enrollmentCourseIdValidation, markAsComplete);
router.route("/me").get(authorizeRole("student"), getMyEnrollments);
router.route("/").get(authorizeRole("admin"), getAllEnrollments);
export default router;
