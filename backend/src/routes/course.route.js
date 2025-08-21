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
const router = Router();

router.use(verifyJwtTokens);
//post for admin/instructor
router
  .route("/")
  .post(
    authorizeRole("admin", "instructor"),
    createCourseValidations,
    createCourse
  )
  .get(getAllCourses);

router
  .route("/:id/publish")
  .patch(authorizeRole("instructor"), courseIdValidation, togglePublished);

router
  .route("/:id")
  .get(courseIdValidation, getCourseById)
  .patch(
    authorizeRole("admin", "instructor"),
    updateCourseValidations,
    updateCourse
  )
  .delete(
    authorizeRole("admin", "instructor"),
    courseIdValidation,
    deleteCourse
  );
export default router;
