import express from "express";
import {
  editprofile,
  getcurrentuser,
  getotheruser,
  search,
} from "../controller/getcurrentuser.js";
import isauth from "../middleware/isAuth.js";
import { upload } from "../middleware/multer.js";

const userrouter = express.Router();

userrouter.get("/current", isauth, getcurrentuser);
userrouter.put("/profile", isauth, upload.single("image"), editprofile);
userrouter.get("/others", isauth, getotheruser);
userrouter.get("/search", isauth, search);

export default userrouter;
