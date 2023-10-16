import express from "express";
import {
  createListing,
  deleteListing,
} from "../controllers/listing.controller.js";
import { varifyToken } from "../utils/varifyUser.js";

const router = express.Router();

router.post("/create", varifyToken, createListing);
router.delete("/delete/:id", varifyToken, deleteListing);

export default router;
