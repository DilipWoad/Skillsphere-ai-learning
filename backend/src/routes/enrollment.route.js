import { Router } from "express";
import { verifyJwtTokens } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";
import { param } from "express-validator";
import { enrollInCourse, getAllEnrollments, getMyEnrollments, markAsComplete } from "../controllers/enrollment.controller.js";

const router = Router();

router.use(verifyJwtTokens);
router
  .route("/:courseId")
  .post(
    authorizeRole("student"),
    param("courseId").isMongoId().withMessage("Invalid course ID"),
    enrollInCourse
  ).patch(
    authorizeRole("student"),
    param("courseId").isMongoId().withMessage("Invalid course Id"),
    markAsComplete
  )
router.route("/me").get(authorizeRole("student"),getMyEnrollments)
router.route("/").get(authorizeRole("admin"),getAllEnrollments)
export default router;
