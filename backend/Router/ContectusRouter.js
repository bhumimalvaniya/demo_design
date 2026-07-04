import express from 'express';
import { deleteContact,featch,contact } from '../Controller/ContectusController.js';

const router=express.Router();

router.post("/contect",contact);
router.get("/featch",featch);
router.delete("/deletecontact/:id",deleteContact);

export default router;