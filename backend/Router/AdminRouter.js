import express from "express";

import {
  changePassword,
  updateAdminProfile,
  getAdminProfile,
  register,
  alogin,
  dashboard,
  getStats,
  updateCategory,
  deletecat,
  featch,
  uplodcategory,
  deleteMenu,
  updateMenu,
  getMenus,
  addMenu
} from "../Controller/AdminController.js";

import { Auth } from "../Middlewears/Auth.js";
import { upload } from "../Middlewears/Multer.js";

import {
  searchEvent,
  updateevent,
  deleteevent,
  getEventDetails,
  featchdata,
  addevent,
  getExpiredCategoryEvents,
  getUpcomingEvents
} from "../Controller/EventController.js";

import event from "../Model/EventSchema.js";

import {
  aboutDeelete,
  updateAbout,
  getAbout,
  addAbout
} from "../Controller/AboutusController.js";

const router = express.Router();

// upcoming and expired events
router.get("/upcoming-events", getUpcomingEvents);
router.get("/expiredevents/:categ", getExpiredCategoryEvents);

// stats
router.get("/stats", Auth, getStats);

// admin
router.post("/login", alogin);
router.post("/register", register);
router.get("/dashboard", Auth, dashboard);
router.get("/getadminprofile", Auth, getAdminProfile);
router.put("/updateadminprofile", Auth, updateAdminProfile);
router.put("/changepassword", Auth, changePassword);

// category
router.post("/uplodcategory", upload.single("image"), uplodcategory);
router.get("/featch", featch);
router.delete("/delete/:id", deletecat);
router.put("/updatecate/:id", upload.single("image"), updateCategory);

// about us
router.get("/getabout", getAbout);
router.post("/addabout", addAbout);
router.put("/updateabout/:id", updateAbout);
router.delete("/deleteabout/:id", aboutDeelete);

// event
router.post("/addevent", upload.single("image"), addevent);
router.get("/featchdata", featchdata);
router.put("/updateevent/:id", upload.single("image"), updateevent);
router.get("/details/:id", getEventDetails);
router.delete("/deleteevent/:id", deleteevent);
router.get("/search/:name", searchEvent);

// menu
router.post("/addmenu", addMenu);
router.get("/getmenu", getMenus);
router.put("/updatemenu/:id", updateMenu);
router.delete("/deletemenu/:id", deleteMenu);

// category-name based fetch — keep this last
router.get("/:cate_nm", async (req, res) => {
  try {
    const events = await event.find({ cate_nm: req.params.cate_nm });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;