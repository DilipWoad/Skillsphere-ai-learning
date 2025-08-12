import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const app = express();

app.use(cors({
    origin:'*',
    credentials:true
}))

//for request coming in json(format)
app.use(express.json({limit:"20kb"}));

//for request coming in url%20formart%20 
//to read by backend easily
app.use(express.urlencoded({limit:"20kb",extended:true}))

//for handling static data->img,videos,pdf,etc
app.use(express.static)

//use for req parsing cookies to the backend
app.use(cookieParser())