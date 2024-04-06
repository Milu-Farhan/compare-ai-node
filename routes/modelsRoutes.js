import express from "express";
import { getAllModels } from "../controller/modelsController.js";
import handleGemini from "../controller/geminiController.js";
import handleChatgpt from "../controller/chatgptController.js";

const router = express.Router();

router.get("/", getAllModels);
router.post("/chatgpt", handleChatgpt);
router.post("/gemini", handleGemini);

export default router;
