import jwt from "jsonwebtoken";

const getToken = async (userid) => {
  try {
    const token = jwt.sign({ userid }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });
    console.log(token);
    return token;
  } catch (error) {
    console.log("jwt token error..");
  }
};
export default getToken;
