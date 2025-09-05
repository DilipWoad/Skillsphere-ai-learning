import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
    lesson:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    completed:{
        type:Boolean,
        default:false
    },
    completedAt:{
        type:Date,
        default:Date.now()
    }
},{timestamps:true})    


const Progress = mongoose.model('progress',progressSchema);


export default Progress;
