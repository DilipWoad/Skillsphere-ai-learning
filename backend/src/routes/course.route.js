import { Router } from "express";
import { verifyJwtTokens } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";
import { body } from "express-validator";
import { createCourse, getAllCourses } from "../controllers/course.controller.js";
const router = Router();

router.use(verifyJwtTokens);
//post for admin/instructor
router
  .route("/")
  .post(
    authorizeRole("admin", "instructor"),
    [
      body("title")
        .notEmpty()
        .withMessage("Title cannot be Empty!!"),
      body("description")
        .notEmpty()
        .withMessage("Description cannot be Empty!!"),
    ],
    createCourse
  ).get(getAllCourses)

export default router;
