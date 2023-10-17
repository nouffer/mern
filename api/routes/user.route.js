import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  getUserListings,
  getUser,
} from "../controllers/user.controller.js";
import { varifyToken } from "../utils/varifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", varifyToken, updateUser);
router.delete("/delete/:id", varifyToken, deleteUser);
router.get("/listings/:id", varifyToken, getUserListings);
router.get("/:id", varifyToken, getUser);

export default router;
