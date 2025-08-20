import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    status: {
      type: String,
      enum: ["enrolled", "completed","cancelled"],
      default: "enrolled",
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    isActive:{
        type:Boolean,
        default:false
    }
  },
  { timestamps: true }
);


export const Enrollment = mongoose.model("Enrollment",enrollmentSchema);