import mongoose from "mongoose";
import History from "../models/historyModel.js";

export const getAllHistory = async (req, res) => {
  const user = req.user;
  const object_id = new mongoose.Types.ObjectId(user);
  History.aggregate([
    {
      $match: { user: object_id },
    },
    {
      $group: {
        _id: "$key",
        documents: { $push: "$$ROOT" },
      },
    },
  ])
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
};
