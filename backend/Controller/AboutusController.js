import about from "../Model/AboutSchema.js";

export const addAbout = async (req, res) => {
  try {

    const { title, description, highlight } = req.body;

    const existdata=await about.findOne({title});
    if(existdata)
    {
        return res.status(300).json({success:false,message:"data is existed"});
    }

    const newAbout = new about({
      title,
      description,
      highlight
    });

    await newAbout.save();
    
    return res.status(201).json({
      success: true,
      message: "About added successfully",
      data: newAbout
    });

  } catch (err) {
    console.log(err);

     res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
export const getAbout =async(req,res)=>{
    try {

    const data = await about.find();

    res.status(200).json(data);

  } catch (error) {

    console.log("while error in code",err);

  }
  console.log("data featch succesfully");
}

export const updateAbout=async(req,res)=>{
    try{
        const {title,description,highlight}=req.body;

        const newdata=await about.findByIdAndUpdate(
            req.params.id,
            {title,description,highlight},
            {new:true}
        )
        res.status(201).json({success:true,message:"data is updated",newdata});
    }
    catch(error){
        res.status(500).json({success:false,message:"error updating data"});
    }
}

export const aboutDeelete=async(req,res)=>{
    try{
        const{id}=req.params;

        const deleted=await about.findByIdAndDelete(id);

        if(!deleted)
        {
            return res.status(201).json({message:"data is not found"});
        }
        return res.status(400).json({message:"data is deleted"});

    }
    catch(error)
    {
        console.error("Error in delete:", error);
    res.status(500).json({ message: "Server error" });
    }
}