import event from "../Model/EventSchema.js";
import uploadOnCloudinary from "../Utils/cloudinary.js";

export const addevent = async (req, res) => {
  try {
    const {
      title,
      start_date,
      end_date,
      start_time,
      end_time,
      price,
      cate_nm,
      cate_id,
      location,
      description
    } = req.body;

    // (/* */) that comment of code use in the upload for image when website is not publish
    /* const image = req.file ? `/public/uploads/${req.file.filename}` : null;*/

    //for multiple image and single image
  //   const image = req.file?.image
  // ? `/public/uploads/${req.files.image[0].filename}`
  // : null;

/*const galleryImages = req.files?.galleryImages
  ? req.files.galleryImages.map(
      (file) => `/public/uploads/${file.filename}`
    )
  : [];*/

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    //that code use for image upload in render when this is publish 
    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

      if (!cloudinaryResponse) {
      return res.status(500).json({
        message: "Image upload failed"
      });
    }

      const image = cloudinaryResponse.secure_url;
    

    if (
      !image || !title || !start_date || !end_date ||
      !start_time || !end_time || !price ||
      !cate_nm || !cate_id || !location || !description
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

   
    const existingEvent = await event.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") },
      start_date: start_date,
      //location: { $regex: new RegExp(`^${location}$`, "i") }
    });

    if (existingEvent) {
      return res.status(409).json({
        message: `Event "${title}" on ${start_date} at ${location} already exists`
      });
    }

    
      //  same cate_nm allow multiple time
    const events = new event({
      image,
      // galleryImages, //multiple image
      title,
      start_date,
      end_date,
      start_time,
      end_time,
      price,
      cate_nm,
      cate_id,
      location,
      description
    });

    await events.save();

    res.status(201).json({
      message: "Event added successfully",
      data: events
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const featchdata=async(req,res)=>{
        try{
          await updateEventStatus();

                const ent=await event.find();
                res.status(201).json(ent);
        }   
        catch(error)
        {
                console.error("while error in code",error);
        }
      
}

export const searchEvent = async (req, res) => {

  try {

    await updateEventStatus();
    const { name } = req.params;

    const eventdata = await event.find({
        status:"upcoming",
       $or: [
        {
          title: {
            $regex: "^"+name,
            $options: "i"
          }
        },
        {
          cate_nm: {
            $regex: "^"+name,
            $options: "i"
          }
        },
        {
        location: {
          $regex: "^"+name,
            $options: "i"
        }
      }
      ]
    });

    res.status(200).json(eventdata);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }

};
export const getEventDetails = async (req, res) => {
  try {
 
   const{id}=req.params;

    const eventdata = await event.findById(id);

    if (!eventdata) {
      return res.status(404).json({ message: "Event not found" });
    }

      
    res.status(200).json(eventdata);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteevent=async(req,res)=>{
            try{
                await event.findByIdAndDelete(req.params.id);
                res.status(200).json({message:"deleted"});
            }
            catch(error){
                res.status(500).json(error);
            }
}

export const updateevent = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      title,
      start_date,
      end_date,
      start_time,
      end_time,
      price,
      location,
      cate_nm
    } = req.body;

    const updateData = {
      title,
      start_date,
      end_date,
      start_time,
      end_time,
      price,
      location,
      cate_nm
    };

    // if new image uploaded in not publish
     /*if (req.file) {
      updateData.image = `/public/uploads/${req.file.filename}`;
    }*/

      //file upload when uploaded image in render
      if (req.file) {
    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

    if (!cloudinaryResponse) {
        return res.status(500).json({
            message: "Image upload failed"
        });
    }

    updateData.image = cloudinaryResponse.secure_url;
}
    const updatedEvent = await event.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.status(200).json({
      message: "Event updated successfully",
      data: updatedEvent
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

// export const updateevent = async (req, res) => {
//   try {
//     const { id } = req.params;

//     console.log("BODY:", req.body);
//     console.log("FILES:", req.files);

//     const existingEvent = await event.findById(id);

//     if (!existingEvent) {
//       return res.status(404).json({
//         message: "Event not found"
//       });
//     }

//     const updateData = {};

//     // text fields
//     if (req.body.title)
//       updateData.title = req.body.title;

//     if (req.body.start_date)
//       updateData.start_date = req.body.start_date;

//     if (req.body.end_date)
//       updateData.end_date = req.body.end_date;

//     if (req.body.price)
//       updateData.price = req.body.price;

//     if (req.body.location)
//       updateData.location = req.body.location;

//     if (req.body.cate_nm)
//       updateData.cate_nm = req.body.cate_nm;

//     if (req.body.start_time)
//       updateData.start_time = req.body.start_time;

//     if (req.body.end_time)
//       updateData.end_time = req.body.end_time;

//     if (req.body.description)
//       updateData.description = req.body.description;

//     if (req.body.cate_id)
//       updateData.cate_id = req.body.cate_id;

//     // Single Image Update
//     if (req.files?.image?.length > 0) {
//       updateData.image =
//         `/public/uploads/${req.files.image[0].filename}`;
//     }

//     // Gallery Images Update
//     if (req.files?.galleryImages?.length > 0) {
//       updateData.galleryImages = [
//         ...(existingEvent.galleryImages || []),
//         ...req.files.galleryImages.map(
//           (file) => `/public/uploads/${file.filename}`
//         )
//       ];
//     }

//     const updatedEvent = await event.findByIdAndUpdate(
//       id,
//       { $set: updateData },
//       {
//         new: true,
//         runValidators: true
//       }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Event updated successfully",
//       data: updatedEvent
//     });

//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//       error: error.message
//     });
//   }
// };

//for rxpired and upcoming event

export const getUpcomingEvents = async (req, res) => {
  try {
      await updateEventStatus();

    const now = new Date();

    console.log("Current Time:", now);

    const events = await event.find({
      status:"upcoming"
    });

    console.log("All Events:", events);

    const upcoming = events.filter((item) => {

      const eventDateTime = new Date(
        `${item.start_date} ${item.start_time}`
      );

      console.log(
        item.title,
        eventDateTime
      );

      return eventDateTime >= now;
    });

    console.log("Upcoming Events:", upcoming);

    res.status(200).json({
      success: true,
      events: upcoming
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// export const getExpiredEvents = async (req, res) => {
//   try {

//     const now = new Date();

//     console.log("current time:",now);

//     const events = await event.find();

//     console.log("All events:",events);

//     const expired = events.filter((event) => {
//       const eventDateTime = new Date(
//         `${event.start_date} ${event.start_time}`
//       );

//       return eventDateTime < now;
//     });
    
//     console.log("expired events",expired);

//     res.status(200).json({
//       success: true,
//       events: expired
//     });

//   } catch (error) {

//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });

//   }
// };

export const getExpiredCategoryEvents = async (req, res) => {
  try {
    const { categ } = req.params;

    const now = new Date();

    await updateEventStatus();  

    const events = await event.find({
      cate_nm: {
        $regex: new RegExp(`^${categ}$`, "i"),
      },
      status:"expired"
    });

    const expiredEvents = events.filter((item) => {
      const eventDateTime = new Date(
        `${item.start_date} ${item.start_time}`
      );

      return eventDateTime < now;
    });

    res.status(200).json(expiredEvents);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const updateEventStatus = async () => {

    const events = await event.find();

    const now = new Date();

    for (const e of events) {

        const eventTime = new Date(
            `${e.start_date} ${e.start_time}`
        );

        const status =
            eventTime < now ? "expired" : "upcoming";

        if (e.status !== status) {

            e.status = status;

            await e.save();

        }

    }

};