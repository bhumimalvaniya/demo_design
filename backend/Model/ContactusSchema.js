import mongoose from "mongoose";

const ContactSchema=new mongoose.Schema({
    
        fullname:String,
        email:String,
        phone:String,
        message:String,

})    
    const cont=mongoose.model("contectus",ContactSchema)
    export default cont;
    
    

