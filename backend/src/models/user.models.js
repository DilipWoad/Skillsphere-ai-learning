import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})

const User = mongoose.model('User',userSchema);
console.log(User)

userSchema.pre('save',async function(next){
    //so in this before "save"-ing to database 
    //do somthing -> i.e hash the password
    if(!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password,10);
        next();
    } catch (error) {
        next(error)
    }
})

userSchema.methods.isCorrectPassword = async function(password){
    try {
        return await bcrypt.compare(password,this.password)
    } catch (error) {
        console.error("Error While checking the hash password : ",error);
        //if error rare -> it will return null 
        //so return false instead;
        return false;
    }
}

