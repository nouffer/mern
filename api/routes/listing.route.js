import express from "express";
import { createListing } from "../controllers/listing.controller.js";
import { varifyToken } from "../utils/varifyUser.js";

const router = express.Router();

router.post("/create", varifyToken, createListing);

export default router;
