import { body } from "express-validator";
import { isPasswordValid } from "../utils/customValidatorFunctions.js";

const validator = [
  body("name").notEmpty().withMessage("Please enter a name"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").custom(isPasswordValid),
];

export default validator;
