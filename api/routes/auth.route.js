import express from "express";
import {
  signin,
  signup,
  authGoogle,
  signout,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/googleauth", authGoogle);
router.get("/signout", signout);

export default router;
