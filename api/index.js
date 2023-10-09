import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to mongo");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json());
app.listen(3000, () => {
  console.log("server runs on port 3000");
});

app.get("/test", (req, res) => {
  res.send("Hello from Node");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use((error, req, res, next) => {
  const statuscode = error.statuscode || 500;
  const message = error.message || "Internal Server Error";
  return res.status(statuscode).json({ success: false, statuscode, message });
});
