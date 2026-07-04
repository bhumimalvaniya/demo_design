import express from "express";

//for admin pages
import { changePassword,updateAdminProfile,getAdminProfile,register,alogin, dashboard } from "../Controller/AdminController.js";
import {Auth} from "../Middlewears/Auth.js";

//for get count event,booking,user
import { getStats } from "../Controller/AdminController.js";

// for postcategory pages
import { upload } from "../Middlewears/Multer.js";
import { updateCategory,deletecat,featch,uplodcategory } from "../Controller/AdminController.js";

//for event pages
//import { upload } from "../Middlewears/Multer.js";
import {searchEvent,updateevent,deleteevent,getEventDetails, featchdata,addevent } from "../Controller/EventController.js";
import event from "../Model/EventSchema.js";
import { User } from "../Middlewears/User.js";

//for about us page
import { aboutDeelete,updateAbout,getAbout,addAbout } from "../Controller/AboutusController.js";

//for menu page
import { deleteMenu,updateMenu,getMenus,addMenu } from "../Controller/AdminController.js";

//for expires and upcoming event
import {getExpiredCategoryEvents, getUpcomingEvents} from "../Controller/EventController.js";

const router=express.Router();

//for rxpire and upcoming event
router.get("/upcoming-events",getUpcomingEvents);
// router.get("/expired-events",getExpiredEvents);
router.get("/expiredevents/:categ",getExpiredCategoryEvents);

//for get count event,booking,user
router.get("/stats", Auth, getStats);


//for admin router
router.post("/login",alogin);
router.post("/register",register);
router.get("/dashboard", Auth, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Admin Dashboard"
  });
});
router.get("/getadminprofile",Auth,getAdminProfile);
router.put("/updateadminprofile",Auth,updateAdminProfile);
router.put("/changepassword",Auth,changePassword);


//for category router
router.post("/uplodcategory",upload.single("image"),uplodcategory);
router.get("/featch",featch);
router.delete("/delete/:id",deletecat);
router.put("/updatecate/:id",upload.single("image"),updateCategory);

//about us

router.get("/getabout",getAbout);

router.post("/addabout",addAbout);

router.put("/updateabout/:id",updateAbout);

router.delete("/deleteabout/:id",aboutDeelete);
//for event router
 router.post("/addevent",upload.single("image"),addevent);
// router.post(
//   "/addevent",
//   upload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "galleryImages", maxCount: 20 }
//   ]),
//   addevent
// );
//featch all events
router.get("/featchdata",featchdata);

//update event data
 router.put("/updateevent/:id",upload.single("image"),updateevent);
// router.put(
//   "/updateevent/:id",
//   upload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "galleryImages", maxCount: 10 }
//   ]),
//   updateevent
// );

//addmenu
router.post("/addmenu",addMenu);
router.get("/getmenu",getMenus);
router.put("/updatemenu/:id",updateMenu);
router.delete("/deletemenu/:id",deleteMenu);

//featch event by id
router.get("/details/:id",getEventDetails);

router.delete("/deleteevent/:id",deleteevent);

router.get("/search/:name",searchEvent);
//featch category
router.get("/:cate_nm", async (req, res) => {
  try {
    const events = await event.find({ cate_nm: req.params.cate_nm })
    res.json(events)
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
});



export default router;