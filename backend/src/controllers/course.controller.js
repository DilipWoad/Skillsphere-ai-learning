import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validationResult } from "express-validator";

const createCourse = async (req, res) => {
  try {
    //first middleware verification
    //second middleware authorization ->admin/instructor
    //then express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.array());
      throw new ApiError(400, "Validation Error", errors.array());
    }
    //then we can access the body from req
    const { title, description, category } = req.body;

    const course = await Course.create({
      title,
      description,
      instructor: req.user._id,
      category: category || "",
    });
    if (!course) {
      throw new ApiError(500, "Failed to create the course in the database.");
    }
    return res
      .status(201)
      .json(new ApiResponse(201, course, "Course created Successfully!!"));
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "A course with this title already exists."); // 409 Conflict
    }

    //throw the original ApiError to be handled by a global error handler
    if (error instanceof ApiError) {
      throw error;//this error is the ApiError response one which was thrown 
      //this will go to the GlobalError
    }

    // If it's not a pre-defined ApiError, wrap it
    throw new ApiError(500, "Something went wrong while creating the course");
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    if (courses.length == 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No courses Available"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, courses, "Courses fetched successfully!"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while fetching the courses");
  }
};

export { createCourse, getAllCourses };
