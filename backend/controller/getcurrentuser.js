import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../moedel/user.js";

export const getcurrentuser = async (req, res) => {
  // console.log(req.userid);
  try {
    let userid = req.userid;
    let user = await User.findById(userid).select("-password");
    if (!user) {
      return res.status(400).json({ message: "user does not define" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `current user error ${error}` });
  }
};

export const editprofile = async (req, res) => {
  try {
    let { name } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    let user = await User.findByIdAndUpdate(
      req.userid,
      {
        name,
        image,
      },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({ message: "user is not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `profile error ${error}` });
  }
};
export const getotheruser = async (req, res) => {
  try {
    let users = await User.find({ _id: { $ne: req.userid } }).select(
      "-password"
    );
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "get other user error" });
  }
};

export const search = async (req, res) => {
  try {
    let { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "query is required" });
    }
    let user = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `user search error ${error}` });
  }
};
