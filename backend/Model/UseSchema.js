//install in "npm install express mongoose cors"

import mongoose from "mongoose";
import bcrypt from "bcrypt";


const UseSchema=new mongoose.Schema({
    fnm:String,
    email:String,
    gender:String,
    phone_no:String,
    password:String,
     avatar: {
      type: String,
      default: null,
    },
   
   /* otp:{
      type:String,
      default:null
    },
    otpExpire:{
      type:Date,
      default:null
    },*/
    isblocked: {
    type: Boolean,
    default: false
  },
    status:{type:String,default:'active'}
})




UseSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});


const cust=mongoose.model("customers",UseSchema)
export default cust;