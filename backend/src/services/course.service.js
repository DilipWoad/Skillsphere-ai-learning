import { validationResult } from "express-validator";
import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/ApiError.js";

const updateCourseService = async (req) => {
  //validateJwt
  //authorize(admin/instructor)
  //body(title,description,category)
  //title and descripiton can't be empty ->category can be
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //can be params too
    throw new ApiError(400, "Feilds cannot be Empty!!", errors.array());
  }
  const { title, description, category, price } = req.body;
  const { id } = req.params;
  const user = req.user;

  const course = await Course.findById(id);
  if (!course) {
    throw new ApiError(404, "Course does not Exists.");
  }
  if (course.instructor.toString() !== user._id.toString()) {
    throw new ApiError(403, "You are not allowed to update this course.");
  }

  if (title) course.title = title;
  if (description) course.description = description;
  if (category) course.category = category;
  if (price !== undefined) course.price = price;

  await course.save();

  return course;
};

const deleteCourseService = async (req) => {
  //valid JWT
  //authorize
  //params valid
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //can be params too
    throw new ApiError(400, "Invalid Id", errors.array());
  }

  const { id } = req.params;
  const user = req.user;

  const course = await Course.findById(id);
  if (!course) {
    throw new ApiError(404, "Course Does not exists");
  }
  if (course.instructor.toString() !== user._id.toString()) {
    throw new ApiError(
      403,
      "You don't have permission to perform this action!"
    );
  }

  const deleteResult = await course.deleteOne();
//this is a promise which return {
  //   "acknowledged": true,
  //   "deletedCount": 1
  // }
  if(deleteResult.deletedCount !== 1){
    throw new ApiError(500,"Could not delete the course,try again")
  }

  return deleteResult;
  
};

export { updateCourseService, deleteCourseService };
