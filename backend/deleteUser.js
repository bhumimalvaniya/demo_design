/* import mongoose from "mongoose";
import cust from "./Model/UseSchema.js";
import dotenv from "dotenv";

dotenv.config();

const deleteUserByPhone = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const result = await cust.deleteOne({ phone_no: "4343434343" });
    console.log(`Deleted ${result.deletedCount} user(s)`);

    await mongoose.connection.close();
    console.log("User deleted successfully! Now re-register with the same credentials.");
  } catch (error) {
    console.error("Error:", error);
  }
};

deleteUserByPhone();
 */