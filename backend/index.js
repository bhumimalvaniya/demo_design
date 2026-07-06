import dotenv from "dotenv";//npm i dotenv
dotenv.config();

import mongoose from "mongoose";//npm i mongoose 
import express from "express";//npm i express mongoose
import UserRouter from "./Router/UserRouter.js";
import ContectusRouter from "./Router/ContectusRouter.js";
import PostRouter from "./Router/PostRouter.js";
import AdminRouter from "./Router/AdminRouter.js";


import cors from "cors";
import path from "path";

const app=express();

app.use(express.json());

app.use(cors());
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1/cust',UserRouter);
app.use("/api/v1/admin",AdminRouter);
app.use('/api/v1/cont',ContectusRouter);
app.use('/api/v1/gallary',PostRouter);
app.use("/uploads", express.static("public/uploads"));




const PORT=process.env.PORT;
const MONGOURL=process.env.MONGOURL;


mongoose.connect(MONGOURL)
    .then(()=>{
        console.log("database connected successfully");
        //added
        app.get("/", (req, res) => {
  res.send("Backend API is running successfully 🚀");
});
        
app.listen(PORT,()=>{
            console.log(`server is running on portion : ${PORT}`)
        })
    })
    .catch((error)=>console.log(error))