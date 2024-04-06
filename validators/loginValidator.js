import { body } from "express-validator";

const loginValidator = [body("email").isEmail(), body("password").notEmpty()];

export default loginValidator;
