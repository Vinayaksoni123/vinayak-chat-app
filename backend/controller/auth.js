import getToken from "../config/jwttoken.js";
import User from "../moedel/user.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const checkUserByUserName = await User.findOne({ username });

    if (checkUserByUserName) {
      return res.status(400).json({ messsage: "username already exist" });
    }
    const checkEmailByEmail = await User.findOne({ email });

    if (checkEmailByEmail) {
      return res.status(400).json({ message: "email already exist" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be at least 6 character.." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = await getToken(user._id);

    res.cookie("token", token, {
      httpOnly: true, //xss atteck
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: false,
      saneSite: "strict", //for security
    });
    return res.status(201).json({ message: "user signup successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error });
  }
};

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "user does not exist" });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "password does not match" });
//     }
//     const token = await getToken(user._id);

//     res.cookie("token", token, {
//       httpOnly: true, //xss atteck
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//       secure: false,
//       saneSite: "strict", //for security
//     });
//     return res.status(201).json({ message: "user Login successfully", user });
//   } catch (error) {
//     return res.status(500).json({ message: "internal server error", error });
//   }
// };

// new code
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" }); // Generic message for security
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await getToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production', // true in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // adjust for development
      domain: process.env.COOKIE_DOMAIN // if using cross-domain
    });

    // Remove sensitive data before sending response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return res.status(200).json({ 
      message: "Login successful", 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token");
    return res
      .status(200)
      .json({ message: "you are loged out successfully.." });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};
