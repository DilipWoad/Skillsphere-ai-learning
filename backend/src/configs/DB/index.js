import mongoose from "mongoose";
import { DB_NAME } from "../../constant.js";

const connectDb = async () => {
  try {
    const mongoDbInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}${DB_NAME}`
    );
    console.log(
      "MongoDb connected Successfully!! host :",
      mongoDbInstance.connection.host
    );
  } catch (error) {
    console.error(`Error while connecting to the MongoDb!! : ${error}`);
    process.exit(1);
  }
};

export default connectDb;
