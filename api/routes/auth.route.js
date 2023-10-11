import express from "express";
import { signin, signup, authGoogle } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/googleauth", authGoogle);

export default router;
