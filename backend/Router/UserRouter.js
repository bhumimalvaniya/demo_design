import express from "express";
import { deleteuser,resetPassword,verifyOTP,sendotp,updateAvatar,updateUser,avatar,getcurrentUser,changePassword,toggleblockuser,featch,login,register } from "../Controller/Usercontroller.js";
import { User } from "../Middlewears/User.js";
import { upload } from "../Middlewears/Multer.js";
import { updateBookingStatus,deleteticket,showallBookings,getBooking ,booking} from "../Controller/BookingController.js";

const router=express.Router();

//user router

router.post("/register",register);
router.post("/avatar",upload.single("avatar"),avatar);
router.post("/login",login);
router.get("/featch",featch);
router.put("/toggle/:id",toggleblockuser);
router.post("/changepass",changePassword)
router.get("/getcurrentuser",User,getcurrentUser);
router.put("/updateuser",User,updateUser)
router.put("/updateavatar",User, upload.single("avatar"), updateAvatar);
router.post("/send-otp", sendotp);
router.post("/verify-otp", verifyOTP);
router.post("/resetpassword",resetPassword);
router.delete("/deleteuser/:id",deleteuser);

//booking router
router.post("/booking",User,booking);
router.get("/getbook/:id",User,getBooking);
router.get("/showallbook",showallBookings);
router.delete("/delete/:id",deleteticket);
router.put("/updatestatus/:id",updateBookingStatus);


export default router;
