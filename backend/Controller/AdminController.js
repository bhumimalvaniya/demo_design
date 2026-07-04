
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";//npm i jsonwebtoken

import admin from "../Model/AdminSchema.js"
import category from "../Model/CategorySchema.js";
import menu from "../Model/MenuSchema.js";

//for get count user,event,booking etc...
import User from "../Model/UseSchema.js";
import Event from "../Model/EventSchema.js";
import Booking from "../Model/BookingSchema.js";
import gallary from "../Model/GallarySchema.js";

import uploadOnCloudinary from "../Utils/cloudinary.js";

//for get count user,event,booking 

export const getStats = async (req, res) => {
  try {
    // Total Counts
    const users = await User.countDocuments();
    const events = await Event.countDocuments();
    const bookings = await Booking.countDocuments();
    const categorys = await category.countDocuments();
    const gallarys = await gallary.countDocuments();

    // Current Date & Time
    const now = new Date();

    // Get all events
    const allEvents = await Event.find();

    // Count Upcoming Events
    let upcoming = 0;
    let expired=0;

    allEvents.forEach((event) => {
      // Combine date and time
      const eventDateTime = new Date(
        `${event.start_date} ${event.start_time}`
      );

      if (eventDateTime >= now) {
        upcoming++;
      }
      else{
        expired++;
      }
    });

    res.status(200).json({
      users,
      events,
      bookings,
      categorys,
      gallarys,
      upcoming,
      expired
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const alogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("admin login attempt:",{email,password});

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const admins = await admin.findOne({ email });
     console.log("admin found:", admins ? "Yes" : "No");

    if (!admins) {
      return res.status(404).json({
        success: false,
        message: "No record found"
      });
    }
 if (!admins.password) {
      console.log("Password missing in DB");
      return res.status(500).json({
        success: false,
        message: "Password not set",
      });
    }
  const isMatch = await bcrypt.compare(password, admins.password);
 
      console.log("Password Match:", isMatch);
       console.log("Stored hash length:", admins.password.length);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password"
      });
    }
    //create JWT TOKEN

      const token = jwt.sign(
      { id: admins._id },
       process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRE}
    );
    

     return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
        admin: {
        id: admins._id,
        name: admins.name,
        email: admins.email,
      }
    });

      
    

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newad=await admin.create({
      name,
      email,
      password: hashedPassword
    });

 

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const dashboard = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome Admin",
    admin: req.admin
  });
};

export const logoutAdmin = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully"
  });
};


export const getAdminProfile = async (req, res) => {
  try {
    const adminData = await admin.findById(req.admin.id).select("-password");
    console.log(req.admin);

      if (!adminData) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }
    res.status(200).json({
      success: true,
      message:"admin data featch successfully",
      data: adminData,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const updatedAdmin = await admin.findByIdAndUpdate(
      req.admin.id,
      { name, email },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message:"admin data updated",
      data: updatedAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

export const changePassword = async (req, res) => {
  try {
    console.log("REQ.ADMIN:", req.admin);
    console.log("BODY:", req.body);

    const adminId = req.admin?.id || req.admin?._id;

    const { password, newPassword, confirmPassword } = req.body;

    if (!password || !newPassword || !confirmPassword) {
      return res.status(402).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const admins = await admin.findById(adminId);

    console.log("ADMIN FROM DB:", admins);

    if (!admins) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admins.password);

    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    admins.password = await bcrypt.hash(newPassword, 10);

    await admins.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.log("CHANGE PASSWORD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const uplodcategory=async(req,res)=>{
    try{
            const{cate_nm}=req.body;
            const image=req.file?req.file.filename:null;

            if(!cate_nm || !image)
                {
                    return res.status(301).json({message:"category name and category image are required"});
                } 
            
                // Check for duplicate category name
        const existingCategory = await category.findOne({ 
            cate_nm: { $regex: new RegExp(`^${cate_nm}$`, "i") }  // "i" = case-insensitive
        });

        if (existingCategory) {
            return res.status(409).json({ 
                message: `Category "${cate_nm}" already exists` 
            });
        }
                const newCategory=new category({
                    cate_nm,
                    image:`/uploads/${image}`
                });

                await newCategory.save();

                return res.status(201).json({message:"image uploaded succesefully",data:newCategory})
    }
    catch(error){
            console.error(error);
            return res.status(500).json({message:"server error",error});
    }
}


export const featch=async(req,res)=>{
    try{
            const cate=await category.find();
            res.status(201).json(cate);


    }
    catch(error){
              console.error("while error in code ",error)
    }
  
}

export const deletecat=async(req,res)=>{
            try{
                await category.findByIdAndDelete(req.params.id);
                res.status(200).json({message:"deleted"});
            }
            catch(error){
                res.status(500).json(error);
            }
}

//for update categories
export const updateCategory = async (req, res) => {

    try {

        const id = req.params.id;

        const { cate_nm } = req.body;

        let updates = {
            cate_nm
        };

        // if new image uploaded
        if (req.file) {

            updates.image = `/uploads/${req.file.filename}`;

        }

        const updatedCategory =
            await category.findByIdAndUpdate(id,
                { $set: updates },
                { new: true }
            );

        if (!updatedCategory) {

            return res.status(404).json({
                success: false,
                message: "Category not found"
            });

        }

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: updatedCategory
        });

    }
    catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const addMenu = async (req, res) => {
  try {
    const { menuname,menulink } = req.body;

    const menus = await menu.create({
      menuname,menulink
    });

    res.status(201).json({
      success: true,
      menus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMenus = async (req, res) => {
  try {
    const menus = await menu.find();

    res.status(200).json({
      success: true,
      menus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Menu
export const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const {menuname, menulink}=req.body;

    const menus = await menu.findByIdAndUpdate(
      id,
       {
      menuname,
      menulink
    },
      { new: true }
    );

    res.status(200).json({
      success: true,
      menus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Menu
export const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    await menu.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Menu Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};