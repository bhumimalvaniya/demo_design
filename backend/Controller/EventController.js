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
      return res.status(400).json({ message: "Image is required" });
    }

    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

    if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
      return res.status(500).json({ message: "Image upload failed" });
    }

    const image = cloudinaryResponse.secure_url;

    if (
      !title || !start_date || !end_date ||
      !start_time || !end_time || !price ||
      !cate_nm || !cate_id || !location || !description
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEvent = await event.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") },
      start_date
    });

    if (existingEvent) {
      return res.status(409).json({
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
      message: "Event added successfully",
      data: events
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const featchdata = async (req, res) => {
  try {
    await updateEventStatus();
    const ent = await event.find();
    res.status(200).json(ent);
  } catch (error) {
    console.error("while error in code", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const searchEvent = async (req, res) => {
  try {
    await updateEventStatus();
    const { name } = req.params;

    const eventdata = await event.find({
      status: "upcoming",
      $or: [
        { title: { $regex: "^" + name, $options: "i" } },
        { cate_nm: { $regex: "^" + name, $options: "i" } },
        { location: { $regex: "^" + name, $options: "i" } }
      ]
    });

    res.status(200).json(eventdata);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getEventDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const eventdata = await event.findById(id);

    if (!eventdata) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(eventdata);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteevent = async (req, res) => {
  try {
    const deleted = await event.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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

    const updateData = {
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
    };

    if (req.file) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

      if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
        return res.status(500).json({ message: "Image upload failed" });
      }

      updateData.image = cloudinaryResponse.secure_url;
    }

    const updatedEvent = await event.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      message: "Event updated successfully",
      data: updatedEvent
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getUpcomingEvents = async (req, res) => {
  try {
    await updateEventStatus();
    const now = new Date();

    const events = await event.find({ status: "upcoming" });

    const upcoming = events.filter((item) => {
      const eventDateTime = new Date(`${item.start_date} ${item.start_time}`);
      return eventDateTime >= now;
    });

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

export const getExpiredCategoryEvents = async (req, res) => {
  try {
    const { categ } = req.params;
    const now = new Date();

    await updateEventStatus();

    const events = await event.find({
      cate_nm: { $regex: new RegExp(`^${categ}$`, "i") },
      status: "expired"
    });

    const expiredEvents = events.filter((item) => {
      const eventDateTime = new Date(`${item.start_date} ${item.start_time}`);
      return eventDateTime < now;
    });

    res.status(200).json(expiredEvents);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

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