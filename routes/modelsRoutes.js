import express from "express";
import { getAllModels } from "../controller/modelsController.js";
import geminiHandler from "../controller/geminiController.js";
import chatGptHandler from "../controller/chatgptController.js";
import claudeHandler from "../controller/claudeController.js";

const router = express.Router();

router.get("/", getAllModels);
router.post("/chatgpt", chatGptHandler);
router.post("/gemini", geminiHandler);
router.post("/claude", claudeHandler);

export default router;
