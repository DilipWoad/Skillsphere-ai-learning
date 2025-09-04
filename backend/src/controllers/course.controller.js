import { Course } from "../models/course.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import {
  deleteCourseService,
  updateCourseService,
} from "../services/course.service.js";
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
    const updatedCourse = await updateCourseService(req);
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedCourse, "Course updated successfully!")
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

// Here it will be Course Lessons Controllers
const addLesson = async (req, res) => {
  try {
    //for adding a lesson to a course
    //1)verfiy jwt
    //2)authorized for Instructor role
    //3)correct couseId
    //4)check validation result using express-validator
    //5)validation includes ->title,content,videourl,order
    //6)and course owner should be the current loggedIn Instructor
    //7)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(401, "Invalid feilds Info.", errors.array());
    }
    const currentInstructor = req.user;
    const { id } = req.params;
    const { title, content, videoUrl, order } = req.body;

    //find course using id
    const course = await Course.findById(id);
    if (!course) {
      throw new ApiError(404, "Course does not exists.");
    }
    //if exists match the owner with current instructor
    if (course.instructor.toString() !== currentInstructor._id.toString()) {
      throw new ApiError(403, "You don't have permission.");
    }
    //check the order
    let lessonOrder = order;
    if (lessonOrder === undefined) {
      //then increment the lesson-order by 1;
      lessonOrder = course.lessons.length + 1;
    }
    //make a lessonObj
    const lesson = {
      title,
      content,
      videoUrl,
      order: lessonOrder,
    };
    //now we can push in the copurse ->lesson[] array
    course.lessons.push(lesson);
    await course.save();

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          course,
          `Lesson No. ${lessonOrder} Added sucessfully to the course ${course.title}`
        )
      );
  } catch (error) {
    console.error("Error while adding lesson to the course. : ", error);

    //if error comming from the ApiError
    if (error instanceof ApiError) {
      //then throw the ApiError to the global error
      throw error;
    }

    throw new ApiError(
      500,
      "Something went wrong while adding lesson to the Course."
    );
  }
};

const updateLesson = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(401, "Invalid feilds Info.", errors.array());
    }
    const currentInstructor = req.user;
    const { id, lessonId } = req.params;
    const { title, content } = req.body;

    //find course using id
    const course = await Course.findById(id);
    if (!course) {
      throw new ApiError(404, "Course does not exists.");
    }
    //if exists match the owner with current instructor
    if (course.instructor.toString() !== currentInstructor._id.toString()) {
      throw new ApiError(403, "You don't have permission.");
    }

    //check if this lesson exists in the course
    const lessonToUpdate = course.lessons.find(
      (lesson) => lesson._id.toString() === lessonId
    );

    if (!lessonToUpdate) {
      throw new ApiError(404, "Lesson does not exists in the Course.");
    }

    //update the lessonObj
    lessonToUpdate.title = title;
    lessonToUpdate.content = content;

    //save
    await course.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          course,
          `Lesson "${lessonToUpdate.title}" updated successfully.`
        )
      );
  } catch (error) {
    console.error("Error while updating lesson to the course. : ", error);

    //if error comming from the ApiError
    if (error instanceof ApiError) {
      //then throw the ApiError to the global error
      throw error;
    }

    throw new ApiError(
      500,
      "Something went wrong while updating lesson to the Course."
    );
  }
};

const deleteLesson = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(401, "Invalid Ids.", errors.array());
    }
    const currentInstructor = req.user;
    const { id, lessonId } = req.params;

    //find course using id
    const course = await Course.findById(id);
    if (!course) {
      throw new ApiError(404, "Course does not exists.");
    }
    //if exists match the owner with current instructor
    if (course.instructor.toString() !== currentInstructor._id.toString()) {
      throw new ApiError(403, "You don't have permission.");
    }

    //check if this lesson exists in the course

    const lessonExists = course.lessons.find(
      (lesson) => lesson._id.toString() !== lessonId
    );

    if (!lessonExists) {
      throw new ApiError(404, "Lesson does not exists in the Course.");
    }

    //delete the lessonObj by filter
    course.lessons = course.lessons.filter(
      (lesson) => lesson._id.toString() !== lessonId // Keep lessons that DON'T match
    );
    // course.lessons.filter((lesson) => lesson._id.toString() === lessonId);
    //save
    await course.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          [],
          `Lesson "${lessonExists.title}" Deleted successfully from the ${course.title}.`
        )
      );
  } catch (error) {
    console.error("Error while deleting a lesson from the course. : ", error);

    //if error comming from the ApiError
    if (error instanceof ApiError) {
      //then throw the ApiError to the global error
      throw error;
    }

    throw new ApiError(
      500,
      "Something went wrong while deleting a lesson from the Course."
    );
  }
};

const toggleLessonStatus = async (req, res) => {
  try {
    //verifyJWT
    //authorize by Instructur
    //courseId and lesson Id
    //
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(401, "Invalid Id", errors.array());
    }

    const { id, lessonId } = req.params;
    const instructor = req.user;

    const course = await Course.findById(id);
    if (!course) {
      throw new ApiError(404, "Course does not exists");
    }
    //check owner
    if (course.instructor.toString() !== instructor._id.toString()) {
      throw new ApiError(403, "You don't have permission.");
    }

    //find the lesson to be published
    const lessonToUpdateStatus = course.lessons.find(
      (lesson) => lesson._id.toString() === lessonId.toString()
    );

    if (!lessonToUpdateStatus) {
      throw new ApiError(404, "Lesson does not exists.");
    }

    lessonToUpdateStatus.published = !lessonToUpdateStatus.published;
    await course.save();
    return res
      .status(200)
      .json(
        new ApiResponse(200, {}, `Lesson ${lessonToUpdateStatus.published ? "published" : "unpublished"} successfully`)
      );
  } catch (error) {
    console.error("Error while updating lesson published status. : ", error);

    //if error comming from the ApiError
    if (error instanceof ApiError) {
      //then throw the ApiError to the global error
      throw error;
    }

    throw new ApiError(
      500,
      "Something went wrong while updating lesson published status."
    );
  }
};

const getCourseLessons = async (req, res) => {
  try {
    //verifyJWT
    //can be seen by anyone-> no auth
    //courseId check
    //validation -> xpress-validator
    console.log("Hellio");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(401, "Invalid Id", errors.array());
    }
    const { id } = req.params;
    const user = req.user;
    console.log(user)
    //find course
    const course = await Course.findById(id);
    if (!course) {
      throw new ApiError(404, "Course does not Exists");
    }

    //for admin or course instructor
    if (
      user.role === "admin" ||
      (user.role === "instructor" &&
        user._id.toString() === course.instructor.toString())
    ) {
      console.log("Its checking here inside")
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            course.lessons,
            "Course lessons fetched successfully."
          )
        );
    }
    console.log("Its checking here")
    //check if course is published or not
    if (!course.published) {
      throw new ApiError(
        403,
        "Course is private or unpublished by the instructor"
      );
    }

    //check if current user  has enrolled to the course
    const isCurrentStudentEnrolled = await Enrollment.findOne({
      course: id,
      student: user._id,
    });
    if (!isCurrentStudentEnrolled) {
      throw new ApiError(403, "You are not Enrolled to the Course.");
    }

    const lessons = course.lessons.filter(
      (lesson) => lesson.published === true
    );
    //if yes -> then procced to show all the lesson array
    return res
      .status(200)
      .json(
        new ApiResponse(200, lessons, "Course Lessons fetched Successfully!")
      );
  } catch (error) {
    console.error("Error while getting course lessons. : ", error);

    //if error comming from the ApiError
    if (error instanceof ApiError) {
      //then throw the ApiError to the global error
      throw error;
    }

    throw new ApiError(
      500,
      "Something went wrong while fetching lessons from the Course."
    );
  }
};

const getLessonById = async (req, res) => {
  try {
    //verifyJWT
    //can be seen by anyone-> no auth
    //courseId check
    //validation -> xpress-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(401, "Invalid Id", errors.array());
    }
    const { id, lessonId } = req.params;
    const user = req.user;
    //find course
    const course = await Course.findById(id);
    if (!course) {
      throw new ApiError(404, "Course does not Exists");
    }

    //for admin or course instructor
    if (
      user.role === "admin" ||
      (user.role === "instructor" &&
        user._id.toString() === course.instructor.toString())
    ) {
      const lesson = course.lessons.find(
        (lesson) => lesson._id.toString() === lessonId.toString()
      );
      if (!lesson) {
        throw new ApiError(404, "Lesson does not Exits");
      }
      return res
        .status(200)
        .json(
          new ApiResponse(200, lesson, "Course lessons fetched successfully.")
        );
    }
    //check if course is published or not
    if (!course.published) {
      throw new ApiError(
        403,
        "Course is private or unpublished by the instructor"
      );
    }

    //check if current user  has enrolled to the course
    const isCurrentStudentEnrolled = await Enrollment.findOne({
      course: id,
      student: user._id,
    });
    if (!isCurrentStudentEnrolled) {
      throw new ApiError(403, "You are not Enrolled to the Course.");
    }

    const lesson = course.lessons.find(
      (lesson) => lesson._id.toString() === lessonId.toString()
    );
    //if yes -> then procced to show all the lesson array
    if (!lesson) {
      throw new ApiError(404, "Lesson does not Exits");
    }
    if(!lesson.published){
      throw new ApiError(403, "Lesson you are looking is unpublished.");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, lesson, "Course Lessons fetched Successfully!")
      );
  } catch (error) {
    console.error("Error while getting a lesson. : ", error);

    //if error comming from the ApiError
    if (error instanceof ApiError) {
      //then throw the ApiError to the global error
      throw error;
    }

    throw new ApiError(
      500,
      "Something went wrong while fetching a lesson from the Course."
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
  //lessons-controller
  addLesson,
  updateLesson,
  deleteLesson,
  getCourseLessons,
  toggleLessonStatus,
  getLessonById
};
