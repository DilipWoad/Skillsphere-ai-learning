import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 1,
    },
    published: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    quizzes:[
      quizeSchema
    ]
  },
  { timestamps: true }
);
export default lessonSchema;
