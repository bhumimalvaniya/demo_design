import mongoose from "mongoose";



const CategorySchema=new mongoose.Schema({
    image:{
        type:String,
    },
    createAt:{
        type:Date,
        default:Date.now(),
    },
    cate_nm:{
        type:String,
        required:true,
    }
})

const category=mongoose.model("categories",CategorySchema)
export default category;


