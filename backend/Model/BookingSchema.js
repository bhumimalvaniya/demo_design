import mongoose from "mongoose";


const bookingSchema=new mongoose.Schema({
  ticketId: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    dateTime: {
      type: String,
      required: true,
      
    },

    bookingDate: {
      type: String,
      default: () => new Date().toLocaleDateString(),
    },

    price: {
      type: Number,
      required: true,
    },

    qr: {
      type: String,
      required: true,
    },

    quantity:{
      type:Number,
      required:true,
      default:1,
    },
    // status:{
    //   type:String,
    //   enum:[
    //     "unconfirmed",
    //     "confirmed",
    //     "cancelled",
    //     "processing",
    //     "expired",
    //     "pending",
    //     "approved"

    //   ],
    //   default:"pending"
    // },
    //  optional (if you have login system)
user: {
    type: mongoose.Schema.Types.ObjectId,
   // ref: "User"
   ref:"customers"
  },
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "event"
  },
  /*createdAt: {
    type: Date,
    default: Date.now
  }*/
},
 {
    timestamps: true, // createdAt, updatedAt
  }
)

const book=mongoose.model("Booking",bookingSchema);
export default book;