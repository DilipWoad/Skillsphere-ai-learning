import mongoose from "mongoose";

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
    lessons:[{
      title:{
        type:String,
        required:true
      },
      content:{
        type:String,
        required:true
      },
      videoUrl:{
        type:String,
        required:true
      },
      order:{
        type:Number,
        default:1
      },
      published:{
        type:Boolean,
        default:false
      },
      createdAt:{
        type:Date,
        default:Date.now()
      }
    }]
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
