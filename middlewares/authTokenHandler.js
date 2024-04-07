import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const checkAccessToken = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token)
    return res.status(401).json({
      success: false,
      errorMessage: "Unauthorized request",
    });

  try {
    token = token.split(" ")[1];

    if (!token || token === "null")
      return res
        .status(401)
        .json({ success: false, errorMessage: "Unauthorized request" });

    let verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifiedUser)
      return res
        .status(401)
        .json({ success: false, errorMessage: "Unauthorized request" });

    const isValidUser = await User.findById(verifiedUser.user_id);
    if (!isValidUser)
      return res.status(401).json({
        success: false,
        errorMessage: "Unauthorized request",
      });

    req.user = verifiedUser.user_id;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      errorMessage: err,
    });
  }
};

export default checkAccessToken;
