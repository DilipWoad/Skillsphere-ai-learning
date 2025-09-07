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

// Quiz validator
const quizIdValidation = param("quizId")
  .isMongoId()
  .withMessage("Invalid Quiz Id.");

const addQuizValidations = [
  body("question")
    .trim()
    .notEmpty()
    .withMessage("Quiz question cannot be empty!."),
  body("options")
    .isArray({ min: 2, max: 4 })
    .withMessage("Quiz options should be 2,3 or 4.")
    //and validate if the options are same or not
    //custom -> make a Set of the options -> this Set will have unique value only
    .custom((options) => {
      const uniqueOption = new Set(options);
      //no this will have unique option in it
      //so if any duplicate option will be there the size will differ
      console.log(uniqueOption.size,"compare",options.length)
      if (uniqueOption.size !== options.length) {
        throw new Error("Quiz cannot have duplicate options");
      }
      return true;
    }),
  body("options.*")
    .trim()
    .notEmpty()
    .withMessage("Each option cannot be empty!."),
  body("correctAnswer")
    .trim()
    .notEmpty()
    .withMessage("Correct Answer is required.")
    
];

const updateQuizValidations = [
  body("question")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Quiz question cannot be empty!."),
  body("options")
    .optional()
    .isArray({ min: 2, max: 4 })
    .withMessage("Quiz options should be 2,3 or 4.")
    .custom((options) => {
      const uniqueOption = new Set(options);
      //no this will have unique option in it
      //so if any duplicate option will be there the size will differ
      if (uniqueOption.length !== options.length) {
        throw new Error("Quiz cannot have duplicate options");
      }
      return true;
    }),
  body("options.*")
    .trim()
    .notEmpty()
    .withMessage("Each option cannot be empty!."),
  body("correctAnswer")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Correct Answer is required."),
];


const quizSubmitValidations=[
  body("courseId")
  .trim()
  .notEmpty()
  .withMessage("Course id cannot be empty")
  .isMongoId()
  .withMessage("Invalid course Id."),
  body("lessonId")
  .trim()
  .notEmpty()
  .withMessage("Lesson id cannot be empty")
  .isMongoId()
  .withMessage("Invalid course Id."),
  body("answers")
  .isArray({min:1})
  .withMessage("Attempt question cannot be empty"),
]

export {
  createCourseValidations,
  courseIdValidation,
  updateCourseValidations,
  addCourseLessonValidation,
  lessonIdValidation,
  updateCourseLessonValidation,
  addQuizValidations,
  updateQuizValidations,
  quizIdValidation,
  quizSubmitValidations
};
