import express from "express";
import cors from "cors";

import userRoute from "./routes/userRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoute);

app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    errorMessage: `Requested page ${req.url} not found`,
  });
});

export default app;
