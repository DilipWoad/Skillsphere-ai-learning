import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/ApiError.js";
import { validationResult } from "express-validator";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Enrollment } from "../models/enrollment.model.js";

const addQuizToLesson = async (req, res) => {
  try {
    //verifyJwt
    //authorized for instructor
    //valid ids
    //valid body ->Questio, options,ans
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(401, "Invalid Id", errors.array());
    }
    const { id, lessonId } = req.params;
    const { question, options, correctAnswer } = req.body;
    //find if course exists
    const course = await Course.findById(id);
    if (!course) {
      throw new ApiError(404, "Course does not exists.");
    }
    //if exits check if user is the owner

    if (req.user.role === "instructor") {
      if (course.instructor._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You dont have permission to access this.");
      }
    }
    //if it's the owner ,now check if lesson exists
    const lesson = course.lessons.find(
      (lesson) => lesson._id.toString() === lessonId
    ); //<- error chk lessonId.toString()
    if (!lesson) {
      throw new ApiError(404, "Lesson does not Exists.");
    }

    //if exists then push the quize Obj from body to the quizzes[] in lesson
    const quiz = {
      question,
      options,
      correctAnswer,
    };
    lesson.quizzes.push(quiz);
    await course.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, [], "Quiz added to the lesson Successfully!.")
      );
  } catch (error) {
    console.error("Error while adding a quiz to a lesson :", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      "Something went wrong while adding a quiz to a lesson."
    );
  }
};

const updateQuiz = async (req, res) => {
  try {
    //verifyJwt
    //authorized for instructor
    //valid ids
    //valid body ->Questio, options,ans
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(401, "Invalid Id", errors.array());
    }
    const { id, lessonId, quizId } = req.params;
    const { question, options, correctAnswer } = req.body;
    //find if course exists
    const course = await Course.findById(id);
    if (!course) {
      throw new ApiError(404, "Course does not exists.");
    }
    //if exits check if user is the owner
    if (req.user.role === "instructor") {
      if (course.instructor._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You dont have permission to access this.");
      }
    }
    //if it's the owner ,now check if lesson exists
    const lesson = course.lessons.find(
      (lesson) => lesson._id.toString() === lessonId
    ); //<- error chk lessonId.toString()
    if (!lesson) {
      throw new ApiError(404, "Lesson does not Exists.");
    }

    //if quize exists
    const quiz = lesson.quizzes.find(
      (quiz) => quiz._id.toString() === quizId.toString()
    );

    if (!quiz) {
      throw new ApiError(404, "Quiz does not Exists");
    }

    //if found upadte the changes
    quiz.question = question;
    quiz.options = options;
    quiz.correctAnswer = correctAnswer;
    await course.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, quiz, "Quiz updated in the lesson Successfully!.")
      );
  } catch (error) {
    console.error("Error while updating a quiz in a lesson :", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      "Something went wrong while updating a quiz in a lesson."
    );
  }
};

const deleteQuiz = async (req, res) => {
  try {
    //verifyJwt
    //authorized for instructor
    //valid ids
    //valid body ->Questio, options,ans
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(401, "Invalid Id", errors.array());
    }
    const { id, lessonId, quizId } = req.params;
    //find if course exists
    const course = await Course.findById(id);
    if (!course) {
      throw new ApiError(404, "Course does not exists.");
    }
    //if exits check if user is the owner
    if (req.user.role === "instructor") {
      if (course.instructor._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You dont have permission to access this.");
      }
    }
    //if it's the owner ,now check if lesson exists
    const lesson = course.lessons.find(
      (lesson) => lesson._id.toString() === lessonId
    ); //<- error chk lessonId.toString()
    if (!lesson) {
      throw new ApiError(404, "Lesson does not Exists.");
    }

    //if quize exists
    const quiz = lesson.quizzes.find(
      (quiz) => quiz._id.toString() === quizId.toString()
    );

    if (!quiz) {
      throw new ApiError(404, "Quiz does not Exists");
    }

    lesson.quizzes = lesson.quizzes.filter(
      (quiz) => quiz._id.toString() !== quizId.toString()
    );
    await course.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          [],
          "Quiz deleted from the lesson Successfully!."
        )
      );
  } catch (error) {
    console.error("Error while deleting a quiz from the lesson :", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      "Something went wrong while deleting a quiz from the lesson."
    );
  }
};

const getQuizzes = async (req, res) => {
  try {
    //verifyJwt
    //authorized for instructor
    //valid ids
    //valid body ->Questio, options,ans
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(401, "Invalid Id", errors.array());
    }
    const { id, lessonId } = req.params;
    //find if course exists
    const course = await Course.findById(id);
    if (!course) {
      throw new ApiError(404, "Course does not exists.");
    }
    //if exits check if user is the owner
    const enrolled = await Enrollment.findOne({
      course: id,
      student: req.user._id,
    });

    if (req.user.role === "student") {
      if (!enrolled) {
        throw new ApiError(403, "You are not enrolled to the course.");
      }
    }
    //if it's the owner ,now check if lesson exists
    const lesson = course.lessons.find(
      (lesson) => lesson._id.toString() === lessonId
    ); //<- error chk lessonId.toString()
    if (!lesson) {
      throw new ApiError(404, "Lesson does not Exists.");
    }

    if (lesson.quizzes.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "There is no quiz in the lesson."));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, lesson.quizzes, "Quizzes fetched Successfully!.")
      );
  } catch (error) {
    console.error("Error while fetching quizzes from the lesson :", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      "Something went wrong while fetching quizzes from the lesson."
    );
  }
};

export { addQuizToLesson, updateQuiz, deleteQuiz, getQuizzes };
