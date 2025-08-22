import { Course } from "../models/course.model.js";
import {
  deleteCourseService,
  updateCourseService,
} from "../services/course.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getInstructorCourses = async (req, res) => {
  try {
    //verifyJWT
    //authorize role is "instructor"
    //don't need any validations
    //get the courses with may and may-not be published by this instructor
    //so find in course with role as instructor and has the instructor:current uer id
    const courses = await Course.find({
      instructor: req.user._id,
    });

    if (courses.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "You have not created any courses!"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, courses, "All Course fetched Successfully!!"));
  } catch (error) {
    console.log("Error while Instructor fetching all its courses : ", error);

    throw new ApiError(
      500,
      "Something went wrong while fetching Instructor courses!!"
    );
  }
};

const updateInstructorCourse = async (req, res) => {
  try {
    const updatedCourse = await updateCourseService(req);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedCourse,
          "Course details updated successfully!!"
        )
      );
  } catch (error) {
    console.error("Error while updating the Course Details : ", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      "Something went wrong while Updating the course in DB"
    );
  }
};

const deleteInstructorCourse = async (req, res) => {
  try {
    await deleteCourseService(req);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Course Deleted Successfully!!"));
  } catch (error) {
    console.error("Error while deleting the course : ", error);
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      "Something went wrong while Deleting the course from DB."
    );
  }
};

export { getInstructorCourses, updateInstructorCourse, deleteInstructorCourse };
