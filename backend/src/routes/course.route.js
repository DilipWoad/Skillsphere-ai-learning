import { Router } from "express";
import { verifyJwtTokens } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";
import { body, param } from "express-validator";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
} from "../controllers/course.controller.js";
const router = Router();

router.use(verifyJwtTokens);
//post for admin/instructor
router
  .route("/")
  .post(
    authorizeRole("admin", "instructor"),
    [
      body("title").notEmpty().withMessage("Title cannot be Empty!!"),
      body("description")
        .notEmpty()
        .withMessage("Description cannot be Empty!!"),
    ],
    createCourse
  )
  .get(getAllCourses);

router
  .route("/:id")
  .get(param("id").isMongoId().withMessage("Invalid Course Id."), getCourseById)
  .patch(
    authorizeRole("admin", "instructor"),
    [
      param("id").isMongoId().withMessage("Invalid Course Id."),
      body("title").notEmpty().withMessage("Title cannot be Empty!!"),
      body("description")
        .notEmpty()
        .withMessage("Description cannot be Empty!!"),
    ],
    updateCourse
  )
  .delete(
    authorizeRole("admin", "instructor"),
    param("id").isMongoId().withMessage("Invalid Course Id."),
    deleteCourse
  );
export default router;
