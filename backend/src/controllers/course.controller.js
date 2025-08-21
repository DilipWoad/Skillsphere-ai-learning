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
    const { title, description, category, price } = req.body;

    const course = await Course.create({
      title,
      description,
      instructor: req.user._id,
      category: category || "",
      price,
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
      throw error; //this error is the ApiError response one which was thrown
      //this will go to the GlobalError
    }

    // If it's not a pre-defined ApiError, wrap it
    throw new ApiError(500, "Something went wrong while creating the course");
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      published: true,
    });

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

const getCourseById = async (req, res) => {
  try {
    //verfiyJwt
    //id validation by express-validtor
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, "Invalid ID", errors.array());
    }
    const { id } = req.params;
    //find if course exists
    const course = await Course.findOne({
      _id: id,
      published: true,
    });
    if (!course) {
      throw new ApiError(404, "Course does not exists!!");
    }
    //if present send it
    return res
      .status(200)
      .json(new ApiResponse(200, course, "Course fetched Successfully!!"));
  } catch (error) {
    console.error("Error while fetching a course : ", error);
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, "Something went wrong while Fetching a course!!");
  }
};

const updateCourse = async (req, res) => {
  try {
    //validateJwt
    //authorize(admin/instructor)
    //body(title,description,category)
    //title and descripiton can't be empty ->category can be
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //can be params too
      throw new ApiError(400, "Feilds cannot be Empty!!", errors.array());
    }
    const { title, description, category,price } = req.body;
    const { id } = req.params;

    const course = await Course.findById(id);
    if(!course){
      throw new ApiError(404,"Course does not Exists.");
    }


     if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (price !== undefined) course.price = price;

    await course.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          course,
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

const togglePublished = async (req, res) => {
  try {
    //verifyJWT
    //authorize call
    //params check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(401, "Invalid course Id.");
    }
    //check course exists
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) throw new ApiError(404, "Course does not exist");
    course.published = !course.published;
    await course.save();

    // const course = await Course.findByIdAndUpdate(
    //   id,
    //   {
    //     $set: {
    //       published: !this.published,
    //     },
    //   },
    //   { new: true }
    // );

    // if (!course) {
    //   throw new ApiError(404, "Course does not exists");
    // }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          course,
          `Course ${
            course.published ? "published" : "unpublished"
          } successfully!`
        )
      );
  } catch (error) {
    console.error("Error while toggling published course : ", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      "Something went wrong while Toggling published course."
    );
  }
};

const deleteCourse = async (req, res) => {
  try {
    //valid JWT
    //authorize
    //params valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //can be params too
      throw new ApiError(400, "Invalid Id", errors.array());
    }

    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      throw new ApiError(404, "Course Does not exists");
    }

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

export {
  createCourse,
  getAllCourses,
  getCourseById,
  deleteCourse,
  updateCourse,
  togglePublished,
};
