import express from "express";
import { getAllModels } from "../controller/modelsController.js";
import comparisonController from "../controller/comparisonController.js";

const router = express.Router();

router.get("/", getAllModels);
router.post("/compare", comparisonController);

export default router;
