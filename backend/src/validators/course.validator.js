import { body, param } from "express-validator";

const createCourseValidations = [
  body("title").notEmpty().withMessage("Title cannot be Empty!!"),
  body("description").notEmpty().withMessage("Description cannot be Empty!!"),
];

const courseIdValidation = param("id")
  .isMongoId()
  .withMessage("Invalid Course Id.");

const updateCourseValidations = [
  // param("id").trim().isMongoId().withMessage("Invalid Course Id."),
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

// Lesson Validator
const addCourseLessonValidation = [
  body("title").notEmpty().withMessage("Lesson title cannot be empty!."),
  body("content").notEmpty().withMessage("Lesson content cannot be empty!."),

  // body("videoUrl").notEmpty().withMessage("Lesson content cannot be empty!."),
  //videoUrl should be given by cloudinary -> during the controllor is running
  //before this the middleware will send file to the server
];

const lessonIdValidation = param("lessonId")
  .isMongoId()
  .withMessage("Invalid Lesson Id.");

const updateCourseLessonValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Lesson title cannot be empty!."),
  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Lesson content cannot be empty!."),
    //maybe videoUrl too 
];


export {
  createCourseValidations,
  courseIdValidation,
  updateCourseValidations,
  addCourseLessonValidation,
  lessonIdValidation,
  updateCourseLessonValidation,
};
