// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
const uploadOnCloudinary = async (filepath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_CODE,
  });

  try {
    const uploadresult = await cloudinary.uploader.upload(filepath);
    fs.unlinkSync(filepath);
    return uploadresult.secure_url;
  } catch (error) {
    fs.unlinkSync(filepath);
    console.log(error);
  }
};
export default uploadOnCloudinary;

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "vinayak_dev",
//     allowedformats: ["png", "jpg", "jpeg"],
//   },
// });

// module.exports = {
//   cloudinary,
//   storage,
// };
