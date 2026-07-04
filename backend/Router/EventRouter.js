// import express from "express";
// import { upload } from "../Middlewears/Multer.js";
// import {deleteevent,getEventDetails, featchdata,addevent } from "../Controller/EventController.js";
// import event from "../Model/EventSchema.js";
// import { User } from "../Middlewears/User.js";

// const router=express.Router();


// router.post("/addevent",upload.single("image"),addevent);

// //featch all events
// router.get("/featch",featchdata);

// //featch category
// router.get("/:cate_nm", async (req, res) => {
//   try {
//     const events = await event.find({ cate_nm: req.params.cate_nm })
//     res.json(events)
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" })
//   }
// });

// //featch event by id
// router.get("/details/:id",getEventDetails);

// router.delete("/delete/:id",deleteevent);
// export default router;