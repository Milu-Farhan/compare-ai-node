import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";
import History from "../models/historyModel.js";
import Models from "../models/modelsModel.js";
import calculateCost from "../utils/calculateCost.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const geminiHandler = async (req, res) => {
  try {
    const { prompt, uuid } = req.body;
    const geminiModelInfo = await Models.find({ model_key: "gemini" });
    const startInstant = performance.now();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const response = await model.generateContentStream(prompt);

    let answer = "";
    let latency = 0;
    let starttime = Date.now();

    for await (const chunk of response.stream) {
      if (latency == 0) {
        latency = (Date.now() - starttime) / 1000;
      }
      const chunkText = chunk.text();
      res.write(chunkText);
      answer += chunkText;
    }

    const endInstant = performance.now();

    const prompt_tokens_response = await model.countTokens(prompt);
    const input_tokens = prompt_tokens_response.totalTokens;
    const response_tokens_response = await model.countTokens(answer);
    const output_tokens = response_tokens_response.totalTokens;
    const total_tokens = input_tokens + output_tokens;

    const input_cost = calculateCost(
      geminiModelInfo[0].input_cost[0].price,
      geminiModelInfo[0].input_cost[0].token,
      input_tokens
    );
    const output_cost = calculateCost(
      geminiModelInfo[0].output_cost[0].price,
      geminiModelInfo[0].output_cost[0].token,
      output_tokens
    );
    const total_cost = Number((input_cost + output_cost).toFixed(8));

    const data = {
      modal_name: "Gemini 1.0 Pro",
      model_key: "gemini",
      prompt,
      input_tokens,
      output_tokens,
      total_tokens,
      latency,
      time_taken: `${endInstant - startInstant}`,
      cost: total_cost,
    };

    const user_id = new mongoose.Types.ObjectId(req.user);

    const result = await History.create({
      ...data,
      response: answer,
      key: uuid,
      user: user_id,
    });

    res.end(JSON.stringify(data));
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

export default geminiHandler;
