import Models from "../models/modelsModel.js";

export const getAllModels = async (req, res) => {
  try {
    const models = await Models.find();
    res.json({
      success: true,
      data: models,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      errorMessage: err,
    });
  }
};
