/* import mongoose from "mongoose";
import cust from "./Model/UseSchema.js";
import dotenv from "dotenv";

dotenv.config();

const clearUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const result = await cust.deleteMany({});
    console.log(`Deleted ${result.deletedCount} users`);

    await mongoose.connection.close();
    console.log("Database cleared successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
};

clearUsers();
 */