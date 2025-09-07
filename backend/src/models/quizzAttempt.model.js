import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    answer: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        optionSelected: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Number,
          required: true,
        },
      },
    ],
    score: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const QuizAttempt = mongoose.model("quizAttempt", quizAttemptSchema);

export default QuizAttempt;
