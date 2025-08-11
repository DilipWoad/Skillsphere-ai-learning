import dotenv from "dotenv";
import express from "express";


dotenv.config({
  path: "/.env",
});
// here connect to DB 
//then start the server

const app = express();

const port = process.env.PORT || 8080;
console.log(port)

app.get('/',(req,res)=>{
    res.send("Hello, Dilip to Skill-Sphere AI Learning");
})

app.listen(port,()=>{
    console.log(`Server running at PORT: ${port}`);
})