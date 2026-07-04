import express from "express";
import {upload} from "../Middlewears/Multer.js";
import { updategallary,deletegallary,getGallery,uploadpost } from "../Controller/PostController.js";

const router=express.Router();

router.post("/upload",upload.single("image"),uploadpost);
router.get("/featch",getGallery);
router.delete("/delete/:id",deletegallary);
router.put("/updategallary/:id", upload.single("image"), updategallary);

export default router;
