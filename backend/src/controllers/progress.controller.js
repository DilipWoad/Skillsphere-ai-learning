import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";
import { Course } from "../models/course.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Progress from "../models/progress.model.js";

const markLessonComplete = async (req, res) => {
  try {
    //verifyJWT
    //authorizeRole ->Student
    //id verfication of course and lesson
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(401, "Invalid Id", errors.array());
    }
    const { id, lessonId } = req.params;
    //then check if course exits
    const course = await Course.findById(id);
    if (!course) {
      throw new ApiError(404, "Course does not Exists.");
    }
    //also check if ispublished
    if (!course.published) {
      throw new ApiError(403, "Course is not published.");
    }
    //then check if student is enrolled to this course
    const enrolled = await Enrollment.findOne({
      course: id,
      student: req.user._id,
    });
    if (!enrolled) {
      throw new ApiError(403, "User is not Enrolled to the Course.");
    }
    //then find the lesson from lessons array and check if that exits

    const lesson = course.lessons.find(
      (lesson) => lesson._id.toString() === lessonId.toString()
    );
    console.log("Just id", lesson._id);
    console.log("id with toString", lesson._id.toString());
    if (!lesson) {
      throw new ApiError(404, "Lesson dose not exists.");
    }
    //then mark the lesson as complete
    //mark in progress

    // if(progress.completed){
    //     return res.status(200).json(new ApiResponse(200,[],"Lesson already marked Completed!"))
    // }
    const progress = await Progress.create({
      course: id,
      lesson: lessonId,
      student: req.user._id,
      completed: true,
    });
    console.log("After : ", progress);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          progress,
          "Lesson marked as complete Successfully."
        )
      );
  } catch (error) {
    console.error("Error while marking lesson as complete. : ", error);

    //if error comming from the ApiError
    if (error instanceof ApiError) {
      //then throw the ApiError to the global error
      throw error;
    }

    throw new ApiError(
      500,
      "Something went wrong while marking lesson as complete."
    );
  }
};
const getProgressByCourse = async (req, res) => {
  //in progress model
  //find document by course id and current sudent id with completed:true
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(401, "Invalid Id", errors.array());
    }

    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      throw new ApiError(404, "Course does not Exists.");
    }
    //check if enrolled
    const enrolled = await Enrollment.find({
      course: id,
      student: req.user._id,
    });
    if (!enrolled) {
      throw new ApiError(403, "Student is not enrolled to the course");
    }

    //now get the progress
    const progress = await Progress.find({
      course: id,
      student: req.user._id,
    });
    console.log(progress);
    if (progress.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No completed Lessons"));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          progress,
          "Course completed lesson fetched successfully."
        )
      );
  } catch (error) {
    console.error("Error while fetching Course completed Lesson. : ", error);

    //if error comming from the ApiError
    if (error instanceof ApiError) {
      //then throw the ApiError to the global error
      throw error;
    }

    throw new ApiError(
      500,
      "Something went wrong while fetching Course completed Lesson."
    );
  }
};

const instructorGetStudentProgress = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(401, "Invalid Id", errors.array());
    }

    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      throw new ApiError(404, "Course does not Exists.");
    }
    if (course.instructor.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not the instructor of this course");
    }

    // 2️⃣ Get total lessons in this course
    // const totalLessons = await Lesson.countDocuments({ course: id });
    const totalLessons = course.lessons.filter((lesson)=>lesson.published==true).length
    //check if enrolled
    const enrolled = await Enrollment.find({
      course: id,
    }).populate("student", "name email");

    if (enrolled.length == 0) {
      return res
        .status(200)
        .json(
          new ApiResponse(200, [], "No student is enrolled to the course.")
        );
    }

    // 4️⃣ For each student, fetch their progress
    const studentsProgress = await Promise.all(
      enrolled.map(async (enrollment) => {
        const studentId = enrollment.student._id;

        // count completed lessons from Progress collection
        const completedCount = await Progress.countDocuments({
          course: id,
          student: studentId,
          completed: true,
        });

        const percentage =
          totalLessons > 0
            ? Math.round((completedCount / totalLessons) * 100)
            : 0;

        return {
          studentId,
          name: enrollment.student.name,
          email: enrollment.student.email,
          progress: {
            completedLessons: completedCount,
            totalLessons,
            percentage,
          },
        };
      })
    );

    // 5️⃣ Return response
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          studentsProgress,
          "Fetched student progress successfully"
        )
      );

    //now get the progress
    // const progress = await Progress.find({
    //     course:id
    // });
    // console.log(progress)
    // if (progress.length === 0) {
    //   return res
    //     .status(200)
    //     .json(new ApiResponse(200, [], "No completed Lessons"));
    // }
    // return res
    //   .status(200)
    //   .json(
    //     new ApiResponse(
    //       200,
    //       progress,
    //       "Course completed lesson fetched successfully."
    //     )
    //   );
  } catch (error) {
    console.error(
      "Error while fetching fetching Student Course Progress. : ",
      error
    );

    //if error comming from the ApiError
    if (error instanceof ApiError) {
      //then throw the ApiError to the global error
      throw error;
    }

    throw new ApiError(
      500,
      "Something went wrong while fetching Student Course Progress."
    );
  }
};

export {
  markLessonComplete,
  getProgressByCourse,
  instructorGetStudentProgress,
};
