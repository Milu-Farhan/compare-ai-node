import express from "express";
import cors from "cors";

import userRoute from "./routes/userRoutes.js";
import modelsRoute from "./routes/modelsRoutes.js";
import historyRoute from "./routes/historyRoutes.js";
import checkAccessToken from "./middlewares/authTokenHandler.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoute);
app.use(checkAccessToken);
app.use("/api/models", modelsRoute);
app.use("/api/history", historyRoute);

app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    errorMessage: `Requested page ${req.url} not found`,
  });
});

export default app;
