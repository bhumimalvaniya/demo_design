import mongoose from "mongoose";
import cont from "../Model/ContactusSchema.js";


export const contact=async(req,res)=>{
    try{
            const{fullname,email,phone,message}=req.body;
            if(!fullname||!email||!phone||!message){
                res.status(201).json({message:"all field are required"});
            }


            const existuser=await cont.findOne({email})
            if(existuser)
            {
                res.status(201).json({message:"user already existed"});
            }

            const cdata=new cont({fullname,email,phone,message})

            await cdata.save();

            res.status(200).json({message:"detail added successfully"});
    }
    catch(error){
                console.error("while error in code",error);
    }
}

export const featch=async(req,res)=>{
try{
        const cntdadta=await cont.find();
        res.status(201).json(cntdadta);

}
catch(error){
    console.error("while error in code",error);
}
console.log("data featch successfully");

}

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await cont.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error in delete:", error);
    res.status(500).json({ message: "Server error" });
  }
};