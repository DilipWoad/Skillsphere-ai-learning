import { Router } from "express";
import { verifyJwtTokens } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  togglePublished,
  updateCourse,
} from "../controllers/course.controller.js";
import {
  courseIdValidation,
  createCourseValidations,
  updateCourseValidations,
} from "../validators/course.validator.js";
import { USER_ROLES } from "../constant.js";
const router = Router();

const {STUDENT,INSTRUCTOR,ADMIN} = USER_ROLES;
router.use(verifyJwtTokens);
//post for admin/instructor
router
  .route("/")
  .post(
    authorizeRole(ADMIN,INSTRUCTOR),
    createCourseValidations,
    createCourse
  )
  .get(getAllCourses);

router
  .route("/:id/publish")
  .patch(authorizeRole(INSTRUCTOR), courseIdValidation, togglePublished);

router
  .route("/:id")
  .get(courseIdValidation, getCourseById)
  .patch(
    authorizeRole(ADMIN,INSTRUCTOR),
    updateCourseValidations,
    updateCourse
  )
  .delete(
    authorizeRole(ADMIN,INSTRUCTOR),
    courseIdValidation,
    deleteCourse
  );
export default router;
