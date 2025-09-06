import mongoose from "mongoose";

//quize for each lesson
const quizSchema = new mongoose.Schema({
    question:{
        type:String,
        required
    },
    options:[
        {
            type:String,
            required:true
        }
    ],
    correctAnswer:{
        type:String,
        required:true
    }

},{timestamp:true})


export default quizSchema;