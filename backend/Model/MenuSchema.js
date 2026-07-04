import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema(
  {
    menuname: {
      type: String,
      required: true,
    },

    menulink:{
      type:String,
      required:true,
    }
  },
  { timestamps: true }
);

const menu=mongoose.model("Menu",MenuSchema);
export default menu;