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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    // Upload image to Cloudinary
    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

    if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed"
      });
    }

    const image = cloudinaryResponse.secure_url;

    if (
      !image || !title || !start_date || !end_date ||
      !start_time || !end_time || !price ||
      !cate_nm || !cate_id || !location || !description
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingEvent = await event.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") },
      start_date: start_date
      // location: { $regex: new RegExp(`^${location}$`, "i") }
    });

    if (existingEvent) {
      return res.status(409).json({
        success: false,
        message: `Event "${title}" on ${start_date} at ${location} already exists`
      });
    }

    const events = new event({
      image,
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
      success: true,
      message: "Event added successfully",
      data: events
    });
  } catch (error) {
    console.error("Error in addevent:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const featchdata = async (req, res) => {
  try {
    await updateEventStatus();

    const ent = await event.find();

    res.status(200).json({
      success: true,
      data: ent
    });
  } catch (error) {
    console.error("Error in featchdata:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const searchEvent = async (req, res) => {
  try {
    await updateEventStatus();
    const { name } = req.params;

    const eventdata = await event.find({
      status: "upcoming",
      $or: [
        {
          title: {
            $regex: "^" + name,
            $options: "i"
          }
        },
        {
          cate_nm: {
            $regex: "^" + name,
            $options: "i"
          }
        },
        {
          location: {
            $regex: "^" + name,
            $options: "i"
          }
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: eventdata
    });
  } catch (error) {
    console.error("Error in searchEvent:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

export const getEventDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const eventdata = await event.findById(id);

    if (!eventdata) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    res.status(200).json({
      success: true,
      data: eventdata
    });
  } catch (error) {
    console.error("Error in getEventDetails:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const deleteevent = async (req, res) => {
  try {
    await event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully"
    });
  } catch (error) {
    console.error("Error in deleteevent:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

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
      cate_nm,
      description,
      cate_id
    } = req.body;

    // Build updateData only with provided fields
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (start_date !== undefined) updateData.start_date = start_date;
    if (end_date !== undefined) updateData.end_date = end_date;
    if (start_time !== undefined) updateData.start_time = start_time;
    if (end_time !== undefined) updateData.end_time = end_time;
    if (price !== undefined) updateData.price = price;
    if (location !== undefined) updateData.location = location;
    if (cate_nm !== undefined) updateData.cate_nm = cate_nm;
    if (description !== undefined) updateData.description = description;
    if (cate_id !== undefined) updateData.cate_id = cate_id;

    // File upload when new image is uploaded (Cloudinary)
    if (req.file) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

      if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed"
        });
      }

      updateData.image = cloudinaryResponse.secure_url;
    }

    const updatedEvent = await event.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    console.log("Updated event from DB:", updatedEvent);

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent
    });
  } catch (error) {
    console.error("Error in updateevent:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// Upcoming events
export const getUpcomingEvents = async (req, res) => {
  try {
    await updateEventStatus();

    const now = new Date();
    console.log("Current Time:", now);

    const events = await event.find({
      status: "upcoming"
    });

    console.log("All Events:", events);

    const upcoming = events.filter((item) => {
      const eventDateTime = new Date(`${item.start_date} ${item.start_time}`);
      console.log(item.title, eventDateTime);
      return eventDateTime >= now;
    });

    console.log("Upcoming Events:", upcoming);

    res.status(200).json({
      success: true,
      events: upcoming
    });
  } catch (error) {
    console.error("Error in getUpcomingEvents:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Expired category events
export const getExpiredCategoryEvents = async (req, res) => {
  try {
    const { categ } = req.params;

    const now = new Date();
    await updateEventStatus();

    const events = await event.find({
      cate_nm: {
        $regex: new RegExp(`^${categ}$`, "i")
      },
      status: "expired"
    });

    const expiredEvents = events.filter((item) => {
      const eventDateTime = new Date(`${item.start_date} ${item.start_time}`);
      return eventDateTime < now;
    });

    res.status(200).json({
      success: true,
      data: expiredEvents
    });
  } catch (error) {
    console.error("Error in getExpiredCategoryEvents:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// Helper: update event status (expired / upcoming)
const updateEventStatus = async () => {
  const events = await event.find();
  const now = new Date();

  for (const e of events) {
    const eventTime = new Date(`${e.start_date} ${e.start_time}`);
    const status = eventTime < now ? "expired" : "upcoming";

    if (e.status !== status) {
      e.status = status;
      await e.save();
    }
  }
};