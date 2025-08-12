import dotenv from "dotenv";
import connectDb from "./configs/DB/index.js"
import { app } from "./app.js";

dotenv.config({
  path: "/.env",
});

const port = process.env.PORT || 8080;
// here connect to DB
//then start the server

connectDb()
.then(() => {
  app.listen(port, () => {
    console.log(`Server running at PORT: ${port}`);
  });
}).catch((error)=>{
  console.error("MongoDb to the Server connection error : ",error);
});
