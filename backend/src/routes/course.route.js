import { Router } from "express";
import { verifyJwtTokens } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";
import {
  addLesson,
  createCourse,
  deleteCourse,
  deleteLesson,
  getAllCourses,
  getCourseById,
  getCourseLessons,
  togglePublished,
  updateCourse,
  updateLesson,
  toggleLessonStatus,
  getLessonById,
} from "../controllers/course.controller.js";
import {
  addCourseLessonValidation,
  courseIdValidation,
  createCourseValidations,
  lessonIdValidation,
  updateCourseLessonValidation,
  updateCourseValidations,
} from "../validators/course.validator.js";
import { USER_ROLES } from "../constant.js";
import { addQuizToLesson, deleteQuiz, getQuizzes, updateQuiz } from "../controllers/quiz.controller.js";
const router = Router();

const { STUDENT, INSTRUCTOR, ADMIN } = USER_ROLES;
router.use(verifyJwtTokens);
//post for admin/instructor
router
  .route("/")
  .post(authorizeRole(ADMIN, INSTRUCTOR), createCourseValidations, createCourse)
  .get(getAllCourses);

router
  .route("/:id/publish")
  .patch(authorizeRole(INSTRUCTOR), courseIdValidation, togglePublished);

router
  .route("/:id")
  .get(courseIdValidation, getCourseById)
  .patch(
    authorizeRole(ADMIN, INSTRUCTOR),
    courseIdValidation,
    updateCourseValidations,
    updateCourse
  )
  .delete(authorizeRole(ADMIN, INSTRUCTOR), courseIdValidation, deleteCourse);

// Lessons Routes
router
  .route("/:id/lessons")
  .post(
    authorizeRole(INSTRUCTOR),
    courseIdValidation,
    addCourseLessonValidation,
    addLesson
  )
  .get(courseIdValidation, getCourseLessons);

router
  .route("/:id/lessons/:lessonId")
  .patch(
    authorizeRole(INSTRUCTOR),
    courseIdValidation,
    lessonIdValidation,
    updateCourseLessonValidation,
    updateLesson
  )
  .delete(
    authorizeRole(INSTRUCTOR),
    courseIdValidation,
    lessonIdValidation,
    deleteLesson
  ).get(
    courseIdValidation,
    lessonIdValidation,
    getLessonById
  )

router
  .route("/:id/lessons/:lessonId/status")
  .patch(
    authorizeRole(INSTRUCTOR),
    courseIdValidation,
    lessonIdValidation,
    toggleLessonStatus
  );

  // Quiz Routes

  router.route('/:id/lessons/:lessonId/quizzes').post(
    authorizeRole(INSTRUCTOR,ADMIN),
    courseIdValidation,
    lessonIdValidation,
    //body
    addQuizToLesson
  ).get(
    courseIdValidation,
    lessonIdValidation,
    getQuizzes
  )

   router.route('/:id/lessons/:lessonId/quizzes/:quizId').patch(
    authorizeRole(INSTRUCTOR,ADMIN),
    courseIdValidation,
    lessonIdValidation,
    //quizeIdvalidation and body
    updateQuiz
   ).delete(
    authorizeRole(INSTRUCTOR,ADMIN),
    courseIdValidation,
    lessonIdValidation,
    //quizeIdvalidation
    deleteQuiz
   )
export default router;
