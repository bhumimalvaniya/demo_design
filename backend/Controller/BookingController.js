
import book from "../Model/BookingSchema.js";
import event from"../Model/EventSchema.js";

export const booking = async (req, res) => {
  try {
    const { event_id,quantity } = req.body;

    const eventData = await event.findById(event_id);
      if (!eventData) return res.json({ success: false, message: "Event not found" });

       const ticketId = "TKT-" + Date.now();
      const qr = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketId}`;
      const dateTime = `${eventData.start_date}, ${eventData.start_time}`;
      
//     const existing = await book.findOne({
//       user: req.user._id,
//       event_id: event_id
//     });
//  if (existing) {
//       return res.status(400).json({
//         success: false,
//         message: "Already booked this event"
//       });
//     }
     const books = await book.create({
        event_id,
        ticketId,
        title: eventData.title,
        location: eventData.location,
        dateTime,
        price: eventData.price,
        quantity:quantity||1,
        qr,
        user: req.user._id,
      });

    
    return res.json({
      success: true,
      message: "Event Booked Successfully",
      data: books
    });

  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    });
  }
};
export const getBooking = async (req, res) => {    
  try {

   
    const books = await book.find
    ({ user: req.user._id })
      .populate("event_id","cate_nm");

    console.log("FILTERED BOOKINGS:", books);

    if(books.length===0)
    {
      return res.json({success:true,message:"No Event Booked",data:[]})
    }
    return res.json({
      success: true,
      message: "Booking event fetched",
      data: books
    });

  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    });
  }
}
// for show all the bookings
export const showallBookings = async (req, res) => {
    try {
        const bookings = await book.find()
        .populate("user","fnm email")
        .populate("event_id","cate_nm start_date")

        return res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
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

export const deleteticket = async (req, res) => {
  try {
    console.log("req.params.id:", req.params.id); 
    
    const deleted = await book.findByIdAndDelete(req.params.id);
    
    console.log("deleted result:", deleted); 
    
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingStatus=async(req,res)=>{
   try {

    const { status } = req.body;

    const updatedBooking = await book.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({
      success: true,
      data: updatedBooking
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message
    });

  }
}