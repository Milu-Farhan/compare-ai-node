import express from "express";
import { getAllHistory } from "../controller/historyController.js";

const router = express.Router();

router.get("/", getAllHistory);

export default router;
