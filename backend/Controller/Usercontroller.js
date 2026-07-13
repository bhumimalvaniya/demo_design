
import bcrypt from "bcrypt";
import cust from "../Model/UseSchema.js";
import uploadOnCloudinary from "../Utils/cloudinary.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import { sendOtp, verifyOtpCode } from "../Utils/sendOtp.js";

export const register=async(req,res)=>{
    try{
        const {fnm,email,gender,phone_no,password,conpass}=req.body;

        if(!fnm||!email||!gender||!phone_no||!password||!conpass){
            return res.status(400).json({message:"all field are required"});
        }

        if(password!==conpass)
        {
          return res.status(400).json({message:"password do not match"});
        }
        const existuser=await cust.findOne({email})
        if(existuser){
            return res.status(409).json({message:"user already exist"})
        }

       
        const user=new cust({
            fnm,
            email,
            gender,
            phone_no,
            password,
            avatar: gender === "male" 
              ? "https://res.cloudinary.com/dtdlad1ud/image/upload/v1703938887/y18sqhaus4snghlhcscm.jpg"
              : "https://res.cloudinary.com/dtdlad1ud/image/upload/v1703939018/yl9frkeayfp9wftlfz8l.jpg"
        })

        await user.save();

          res.status(201).json({ message: "User registered successfully!" });
    }
    catch(error){
        console.error("while error in code ",error);
        res.status(500).json({message:"server error"});
    }
}

export const avatar = async (req, res) => {
  try {
    const avatarLocalPath = req.file?.path;
    console.log(avatarLocalPath);

    if (!avatarLocalPath) {
      return res.json({
        success: false,
        message: "Avatar file is missing",
      });
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
      return res.json({
        success: false,
        message: "Error while uploading on avatar",
      });
    }

    await cust.findByIdAndUpdate(req.user?._id, {
      $set: {
        avatar: avatar.url,
      },
    });

    return res.json({
      success: true,
      message: "Avatar image updated successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async(req,res) =>{
        try{
            const { phone_no, password } = req.body;
            console.log("Login attempt:", { phone_no, password });
            
            if( !phone_no || !password)
            {
              return  res.status(400).json({message: "All filed are require"})
            }

           const user =await cust.findOne({phone_no});
           console.log("User found:", user ? "Yes" : "No");
           
           if(!user)
           {
            return res.status(404).json({message:"user not found"})
           }

           
                if (user.isblocked) {
                      return res.status(403).json({
                        message: "Your account is suspended",
                      });
                    }
                    
          const isMatch = await bcrypt.compare(password, user.password);
          console.log("Password match:", isMatch);
          console.log("Stored hash length:", user.password.length);
          
          // Temporary fix: If password doesn't match and hash is too long (double-hashed), rehash it
        /* if (!isMatch && user.password.length > 80) {
            console.log("Detected double-hashed password, fixing...");
            user.password = password;
           await user.save();
            console.log("Password fixed! Please try logging in again.");
            return res.status(200).json({
              message: "Password was corrupted and has been fixed. Please login again."
            });
          }*/
          
          if(!isMatch)
          {
                return res.status(401).json({message:"invalid password"})
          }
            // return res.status(200).json({message:"login successfully"});
      const token = jwt.sign(
       {id:user._id},
      process.env.JWT_SECRET_KEY,
     {expiresIn:process.env.JWT_EXPIRE}
     );
              
     return res
      .status(200)
      .json({
        message: "Login successful",
        token,
        user: {
          _id: user._id,
          fnm: user.fnm,
          phone_no: user.phone_no,
          email: user.email,
           avatar: user.avatar 
        }
      });
        }
        catch(error){
            console.error("While Error in code", error);
             return res.status(500).json({message:"server error"});
        }
    }           

export const featch =async(req,res)=>{
    try{
        const Users=await cust.find();
       return  res.status(201).json(Users);
    }
    catch(error){
        console.error("while error in code ",error);

        
          return res.status(500).json({message:"server error"});
    }
  
}

export const deleteuser=async(req,res)=>{
  try{
    await cust.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"deleted"});

  }
  catch(error)
  {
      res.status(500).json(error);
  }
}
export const toggleblockuser = async (req, res) => {
  try {
    const user = await cust.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isblocked = !user.isblocked;
    await user.save();

    
    res.json({ success: true, message: "Status updated", isblocked: user.isblocked });
  } catch (err) {
    console.error("Error in toggle:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, password, newPassword } = req.body;

    if (!email || !password || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await cust.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    
    
await cust.findByIdAndUpdate(user._id, { password: hashedPassword });

    await user.save();

    res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    console.log("Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getcurrentUser = async (req, res) => {
  try {
   
    return res.json({
      success: true,
      message: "userdata fetch successfully",
     data: req.user,
    
    });
  } catch (error) {
    return res.json({
      success: 0,
      message: error.message,
    });
  }
};


export const updateUser = async (req, res) => {
  try {
    const { fnm, email, gender, phone_no } = req.body;

    const user = await cust.findByIdAndUpdate(
      req.user._id,
      {
        fnm,
        email,
        gender,
        phone_no
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user"
    });
  }
};

/*export const updateAvatar = async (req, res) => {
  try {

   console.log("REQ USER:", req.user);
    console.log("REQ FILE:", req.file);

    
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const avatarPath = req.file.filename;

    const user = await cust.findByIdAndUpdate(
      userId,
      { avatar: avatarPath },
      { new: true }
    );

    res.status(200).json({
      message: "Avatar updated successfully",
      avatar:avatarPath,
      data: user
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
*/
export const updateAvatar = async (req, res) => {
  try {
    const userId = req.user._id;

    const userData = await cust.findById(userId);

    let avatarUrl = "";
    console.log(req.file ? "true": "false");
    
    
    if (req.file) {      
      const cloudinaryRes = await uploadOnCloudinary(req.file.path);

      if (!cloudinaryRes?.url) {
        return res.status(500).json({ message: "Upload failed" });
      }

      avatarUrl = cloudinaryRes.url;
    } 
    // ✅ Case 2: file is not available → gender default
    else {
      avatarUrl =
        userData.gender === "male"
        ?"https://res.cloudinary.com/dtdlad1ud/image/upload/v1703939018/yl9frkeayfp9wftlfz8l.jpg"
           :"https://res.cloudinary.com/dtdlad1ud/image/upload/v1703938887/y18sqhaus4snghlhcscm.jpg"
              
    }

    const updatedUser = await cust.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    );

    res.status(200).json({
      message: "Avatar updated",
      data: updatedUser,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// SEND OTP
/*export const sendotp = async (req, res) => {

  try {

    const { phone_no } = req.body;

    if (!phone_no) {
      return res.status(400).json({
        success: false,
        message: "Mobile number required"
      });
    }

    const user = await cust.findOne({ phone_no });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    
    const msg = `Your event otp is ${otp}`;

    const data = await sendOtp(phone_no, msg);

     console.log(data);

    if (!data.success ) {
      return res.json({
        success: false,
        message: "something want to wrong please try again after some time",
      });
    }
    
    user.otp = otp;
   user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 minutes

    await user.save();

    console.log("OTP:", otp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};*/
export const sendotp = async (req, res) => {
  try {
    const { phone_no } = req.body;

    if (!phone_no || phone_no.length !== 10) {
      return res.status(400).json({ message: "Valid 10-digit number required" });
    }

    const user = await cust.findOne({ phone_no });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otpSent = await sendOtp(phone_no);

    if (!otpSent) {
      return res.status(500).json({ message: "Failed to send OTP" });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("sendotp error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { phone_no, otp } = req.body;

    if (!phone_no || !otp) {
      return res.status(400).json({ message: "Phone and OTP required" });
    }

    const isValid = await verifyOtpCode(phone_no, otp);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await cust.findOne({ phone_no });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token,
      user: {
        _id: user._id,
        fnm: user.fnm,
        phone_no: user.phone_no,
        email: user.email,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error("verifyOTP error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { phone_no, password } = req.body;

    console.log("Backend received phone_no:", phone_no);
    console.log("Backend received password:", password);
    // ✅ validation
    if (!phone_no || !password) {
      return res.json({ success: false, message: "Phone and password required" });
    }

    if (password.length < 6) {
      return res.json({ success: false, message: "Password must be at least 6 characters" });
    }

    // ✅ find user
    const user = await cust.findOne({ phone_no });
     console.log("User found:", user ? user.phone_no : "NOT FOUND");
   if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // ✅ hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ update password
   // user.password = hashedPassword;
   // await user.save({ validateBeforeSave: false });
await cust.findByIdAndUpdate(user._id, { password: hashedPassword });
 console.log("Password updated successfully");
    return res.json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
/*export const forgotpassword = async (req, res) => {
  try {
    const { id, password } = req.body;
    if (!password) {
      return res.json({
        success: false,
        message: "password field required",
      });
    }

    const user = await cust.findById(id);

    user.password = password;
    await user.save({ validateBeforeSave: false });

    return res.json({
      success: true,
      message: "password change successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};*/