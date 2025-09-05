import mongoose from "mongoose";
import lessonSchema from "./lesson.model.js";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: false,
    },
    lessons:[
      lessonSchema
    ]
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
