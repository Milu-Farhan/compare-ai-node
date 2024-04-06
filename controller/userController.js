import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { validationResult } from "express-validator";

export const signupControl = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let err = {};
      errors.array().forEach((error) => {
        err[error.path] = error.msg;
      });
      throw err;
    }

    let data = { ...req.body };
    const hashedPassword = await bcrypt.hash(data.password, 10);

    data = { ...data, password: hashedPassword };

    const user = await User.create(data);

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      errorMessage: err,
    });
  }
};

export const loginControl = async (req, res) => {
  try {
    const error_message = "Incorrect email or password";
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw error_message;
    }

    const { email, password } = req.body;

    const result = await User.findOne({ email: email });
    if (!result) throw error_message;

    const password_check = await bcrypt.compare(password, result.password);
    if (!password_check) throw error_message;

    const access_token = jwt.sign(
      { user_id: result.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).send({
      success: true,
      data: {
        access_token,
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      errorMessage: err,
    });
  }
};
