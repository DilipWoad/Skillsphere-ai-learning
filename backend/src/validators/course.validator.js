import { body, param } from "express-validator";

const createCourseValidations = [
  body("title").notEmpty().withMessage("Title cannot be Empty!!"),
  body("description").notEmpty().withMessage("Description cannot be Empty!!"),
];

const courseIdValidation = param("id")
  .isMongoId()
  .withMessage("Invalid Course Id.");

const updateCourseValidations = [
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
];

export { createCourseValidations, courseIdValidation, updateCourseValidations };
