import mongoose, { now } from "mongoose";

const GallarySchema=new mongoose.Schema({
   
    image:{
        type:String,
       // required:true,
    },
    createAt:{
        type:Date,
        default:Date.now()
    },
    photo_name:{
        type:String,
        required:true,
    }
});
const gallary=mongoose.model("gallaries",GallarySchema)
export default gallary;