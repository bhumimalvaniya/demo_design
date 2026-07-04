
import mongoose from "mongoose";
import { type } from "os";

const eventSchema=new mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    createAt:{
        type:Date,
        default:Date.now
    },
    title:{
        type:String,
       required:true
    },

    start_date:{
        type:String,
        required:true
    },

    end_date:{
        type:String,
        required:true
    },

    start_time:{
        type:String,
        required:true
    },

    end_time:{
        type:String,
        required:true
    },

    price:{
        type:Number,
        required:true
    },

    cate_id:{
        type:String,
        required:true
    },
    cate_nm:{
        type:String,
        required:true
    },

    location:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    
//     galleryImages: [
//     {
//       type: String
//     }
// ],

status:{
    type:String,
    enum:["upcoming","expired"],
    default:"upcoming"
},

    // availableSeats:{
    //     type:Number,
    //     required:true
    // }
})

const event=mongoose.model("event",eventSchema)
export default event;