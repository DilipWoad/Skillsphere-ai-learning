import { Router } from "express";
import { verifyJwtTokens } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";
import {
  deleteInstructorCourse,
  getInstructorCourses,
  updateInstructorCourse,
} from "../controllers/instructor.controller.js";
import { USER_ROLES } from "../constant.js";
import { courseIdValidation, updateCourseValidations } from "../validators/course.validator.js";

const { INSTRUCTOR, ADMIN, STUDENT } = USER_ROLES;

const router = Router();
//verify each route with access token
router.use(verifyJwtTokens);
router.use(authorizeRole(INSTRUCTOR));
router.route("/courses").get(getInstructorCourses);
router
  .route("/courses/:id")
  .patch(updateCourseValidations,updateInstructorCourse)
  .delete(courseIdValidation,deleteInstructorCourse);

export default router;
