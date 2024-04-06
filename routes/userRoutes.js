import express from "express";
import { loginControl, signupControl } from "../controller/userController.js";
import loginValidator from "../validators/loginValidator.js";
import signupValidator from "../validators/signupValidator.js";

const router = express.Router();

router.post("/signup", signupValidator, signupControl);
router.post("/login", loginValidator, loginControl);

export default router;
