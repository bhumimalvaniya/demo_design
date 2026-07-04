import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const AdminSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },

    password:{
    type:String,
    required:true

    },

    name:{
        type:String,
        required:true
    }

   
})

AdminSchema.methods.generateJsonWebToken = function () {
    return jwt.sign
    ({ 
        id: this._id ,
        email:this.email
    }, 
    process.env.JWT_SECRET_KEY,
     {
        expiresIn: process.env.JWT_EXPIRE
    })
}

AdminSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const admin=mongoose.model("Admin",AdminSchema)
export default admin;