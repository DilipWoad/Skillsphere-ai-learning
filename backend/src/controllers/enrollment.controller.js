import { validationResult } from "express-validator";
import { Enrollment } from "../models/enrollment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Course } from "../models/course.model.js";

//by user only
const enrollInCourse = async (req, res) => {
  try {
    //verifyJWT by middleware
    //authorize user -> i.e student
    //course id vlidation by middleware
    //
    //check the validation attached with the req
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new ApiError(400, "Invalid mongodb ID", errors.array());
    }

    const userId = req.user._id;
    const { courseId } = req.params;

    const courseExists = await Course.findById(courseId);

    if (!courseExists) {
      throw new ApiError(404, "Course Does not Exists!!");
    }

    // see in Enrollment document -> that a document with the
    const isUserEnrolledArealy = await Enrollment.findOne({
      student: userId,
      course: courseId,
    });
    // same user with the same course id had already enrolled or not
    //if found -> return the user that u already enrolled
    if (isUserEnrolledArealy) {
      throw new ApiError(409, "You have already enrolled to this course!!");
    }
    //if all verifed then create a new Document
    const enrollUser = await Enrollment.create({
      student: userId,
      course: courseId,
    });
    if (!enrollUser) {
      throw new ApiError(
        500,
        "Something went wrong will Enrolling to the Course!"
      );
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          enrollUser,
          "User enrolled to a course Successfully"
        )
      );
  } catch (error) {
    console.error("Error while Enrolling User to a course : ", error);
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, "Something went wrong while enrolling the user.");
  }
};

//user only
const getMyEnrollments = async (req, res) => {
  try {
    //verify jwt
    //auth by user
    //no params
    // so userId from req
    // find all the document where user:userId is present

    const userId = req.user;

    const userEnrolledCourses = await Enrollment.find({
      student: userId,
    }).populate({
      path: "course",
      select: "title description _id category",
    });

    if (userEnrolledCourses.length == 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "User has not Enrolled to any course!"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          userEnrolledCourses,
          "User Enrolled courses fetched successfully!!"
        )
      );
  } catch (error) {
    console.error("Error while fetching user all courses : ", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      "Something went wrong while Fertching user all enrolled courses!!"
    );
  }
};

//only by admin
//getting each student enrolled course details
const getAllEnrollments = async (req, res) => {
  try {
    //verify JWT
    //authorize role ->admin
    //no params

    //find the entire entorllment document

    const enrollmentDetails = await Enrollment.find()
      .populate({
        path: "student",
        select: "name email",
      })
      .populate({
        path: "course",
        select: "title description _id category",
      });

    if (enrollmentDetails.length == 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "User has not Enrolled to any course!"));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          enrollmentDetails,
          "All User enrolled Course Details!!"
        )
      );
  } catch (error) {
    console.error("Error while fetching all user courses details : ", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      "Something went wrong while Fetching all user enrolled courses!!"
    );
  }
};

//by student
const markAsComplete = async (req, res) => {
  //by students
  //parms of course id

  try {
    //verifyJWT by middleware
    //authorize user -> i.e student
    //course id vlidation by middleware
    //
    //check the validation attached with the req
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new ApiError(400, "Invalid ID", errors.array());
    }

    const userId = req.user._id;
    const { courseId } = req.params;

    const courseExists = await Course.findById(courseId);

    if (!courseExists) {
      throw new ApiError(404, "Course Does not Exists!!");
    }

    // see in Enrollment document -> that a document with the
    const enrollment = await Enrollment.findOne({
      student: userId,
      course: courseId,
    });
    // same user with the same course id had already enrolled or not
    //if found -> return the user that u already enrolled
    if (!enrollment) {
      throw new ApiError(403, "You are not enrolled in this course.");
    }

    if (enrollment.status === "completed") {
      throw new ApiError(
        409,
        "You have already marked this course as complete."
      );
    }
    //if all verifed then create a new Document
    const courseComplete = await Enrollment.findByIdAndUpdate(
      enrollment._id,
      {
        $set: {
          status: "completed",
        },
      },
      { new: true }
    );

    if (!courseComplete) {
      throw new ApiError(
        500,
        "Something went wrong while Marking Course as complete"
      );
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          courseComplete,
          "User marked course as complete Successfully"
        )
      );
  } catch (error) {
    console.error(
      "Error while Chaning course status to complete to a course : ",
      error
    );
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      "Something went wrong while marking course as complete."
    );
  }
};

//for instructor only
const getEnrolledStudentInCourse = async (req, res) => {
  try {
    //verify jwt,
    //authorize role ->instructor
    // course id ->params validation

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(401, "Invalid course ID", errors.array());
    }

    const { courseId } = req.params;
 

    const course = await Course.findById(courseId);
    if (!course) {
      throw new ApiError(404, "Course does not Exists");
    }
    //what if u are not the creator of that course
    if (course.instructor.toString() !== req.user._id.toString()) {
      throw new ApiError(409, "You are not the creator of this course");
    }
    //if exists find the courses with the courseId,instructor and ID
    const enrolledStudents = await Enrollment.find({
     course: courseId,
    }).populate({
      path: "student",
      select: "-refreshToken -password -role",
    });

    if (enrolledStudents.length === 0) {
      return res
        .status(200)
        .json(
          new ApiResponse(200, [], "No students has enrolled to this course")
        );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          enrolledStudents,
          "Students enrolled to your course, fetched Successfully"
        )
      );
  } catch (error) {
    console.error(
      "Error while fechting enrolled student to the course : ",
      error
    );

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      "Something went wrong while Fetching enrolled student to a course!"
    );
  }
};

export {
  enrollInCourse,
  getAllEnrollments,
  getMyEnrollments,
  markAsComplete,
  getEnrolledStudentInCourse,
};
