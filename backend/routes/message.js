import express from "express";
import isauth from "../middleware/isAuth.js";
import { upload } from "../middleware/multer.js";
import { getMessages, sendmessage } from "../controller/message.js";

const messagerouter = express.Router();

messagerouter.post(
  "/send/:receiver",
  isauth,
  upload.single("image"),
  sendmessage
);
messagerouter.get("/get/:receiver", isauth, getMessages);
export default messagerouter;
