import { param } from "express-validator";

const enrollmentCourseIdValidation = param("courseId")
  .isMongoId()
  .withMessage("Invalid Course Id.");
export {enrollmentCourseIdValidation}