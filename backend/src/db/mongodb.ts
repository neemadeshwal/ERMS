import mongoose from "mongoose";
import { MONGODB_URL } from "../constants/constants";
async function connectDB() {
  try {
    if (!MONGODB_URL) {
      throw new Error("url is not defined");
    }
    await mongoose.connect(MONGODB_URL);
    console.log("Successfully connected to database ......");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export { connectDB };
