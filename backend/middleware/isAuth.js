import jwt from "jsonwebtoken";

// const isauth = async (req, res, next) => {
//   try {
//     let token = req.cookies.token;
//     if (!token) {
//       return res.status(400).json({ message: "token is not foundddddd" });
//     }
//     // console.log(token);
//     let verifytoken = await jwt.verify(token, process.env.JWT_SECRET);
//     // console.log(verifytoken);
//     req.userid = verifytoken.userid;
//     next();
//   } catch (error) {
//     return res.status(500).json({ message: `isAuth error ${error}` });
//   }
// };




// new code
const isauth = async (req, res, next) => {
  try {
    // Check both cookies and Authorization header
    let token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "Authentication required" }); // 401 is more appropriate
    }

    const verifytoken = jwt.verify(token, process.env.JWT_SECRET);
    req.userid = verifytoken.userid;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: `Authentication error: ${error.message}` });
  }
};

export default isauth;
