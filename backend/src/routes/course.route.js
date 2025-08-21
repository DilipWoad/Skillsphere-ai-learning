import { Router } from "express";
import { verifyJwtTokens } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";
import { body, param } from "express-validator";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  togglePublished,
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
  .route("/:id/publish")
  .patch(
    authorizeRole("instructor"),
    param("id").isMongoId().withMessage("Invalid Course Id."),
    togglePublished
  );

router
  .route("/:id")
  .get(param("id").isMongoId().withMessage("Invalid Course Id."), getCourseById)
  .patch(
    authorizeRole("admin", "instructor"),
    [
      param("id").trim().isMongoId().withMessage("Invalid Course Id."),
      body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be Empty!!"),
      body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Description cannot be Empty!!"),
      body("category")
        .optional()
        .isString()
        .withMessage("Category must be a string."),
      body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number."),
    ],
    updateCourse
  )
  .delete(
    authorizeRole("admin", "instructor"),
    param("id").isMongoId().withMessage("Invalid Course Id."),
    deleteCourse
  );
export default router;
