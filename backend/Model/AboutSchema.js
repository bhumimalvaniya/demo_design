import mongoose from "mongoose";

const AboutSchema=new mongoose.Schema({
    title:String,
    description:String,
    highlight:String,
})

const about=mongoose.model("About",AboutSchema)
export default about;