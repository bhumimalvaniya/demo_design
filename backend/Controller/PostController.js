import gallary from "../Model/GallarySchema.js";

import mongoose from "mongoose";

export const uploadpost = async (req, res) => {
  try {
    const { photo_name } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!photo_name || !image) {
      return res.status(400).json({
        message: "photo_name and image are required"
      });
    }

  //check the entered data is exist or not
    const existpost = await gallary.findOne({ photo_name });

    if (existpost) {
      return res.status(409).json({
        message: "Post already exists"
      });
    }

    const newGallary = new gallary({
      photo_name,
      image: `/public/uploads/${image}`
    });

    await newGallary.save();

    res.status(201).json({
      message: "Image uploaded successfully",
      data: newGallary
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const getGallery = async(req,res)=>{
    try{
        const data = await gallary.find();
        return res.status(200).json(data);
    }
    catch(error){
        return res.status(500).json({message:"Server Error",error});
    }
}


export const deletegallary=async(req,res)=>{
            try{
                await gallary.findByIdAndDelete(req.params.id);
                res.status(200).json({message:"deleted"});
            }
            catch(error){
                res.status(500).json(error);
            }
}

export const updategallary = async (req, res) => {
    try {
        const { id } = req.params;
        const { photo_name } = req.body;
        const image = req.file ? `/public/uploads/${req.file.filename}` : null;

        // validated id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        if (!photo_name) {
            return res.status(400).json({ message: "Photo name is required" });
        }

        let updates = { photo_name };

        //  only update image if new image is uploaded
        if (image) {
            updates.image = image;
        }

        const updated = await gallary.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Photo not found" });
        }

        return res.status(200).json({
            message: "Gallery updated successfully",
            data: updated
        });

    } catch (error) {
        return res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        });
    }
};