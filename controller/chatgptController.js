import OpenAI from "openai";
import mongoose from "mongoose";
import createGPTTokens from "../utils/calculateChatgptToken.js";
import History from "../models/historyModel.js";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const chatGptHandler = async (req, res) => {
  try {
    const { prompt, uuid } = req.body;
    const startInstant = performance.now();

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      stream: true,
    });

    let starttime = Date.now();
    let latency = 0;
    let answer = "";

    for await (const part of completion) {
      if (latency === 0) {
        latency = (Date.now() - starttime) / 1000;
      }
      answer += part.choices[0]?.delta.content || "";
      res.write(part.choices[0]?.delta.content || "");
    }

    const endInstant = performance.now();

    const prompt_tokens = createGPTTokens("gpt-3.5-turbo", "user", prompt);
    const completion_tokens = createGPTTokens(
      "gpt-3.5-turbo",
      "assistant",
      answer
    );

    const data = {
      modal_name: "gpt-3.5-turbo",
      model_key: "chatgpt",
      prompt,
      input_tokens: prompt_tokens.usedTokens,
      output_tokens: completion_tokens.usedTokens,
      total_tokens: prompt_tokens.usedTokens + completion_tokens.usedTokens,
      latency,
      time_taken: `${endInstant - startInstant}`,
      cost: Number(prompt_tokens.usedUSD + completion_tokens.usedUSD).toFixed(
        8
      ),
    };
    const user_id = new mongoose.Types.ObjectId(req.user);

    const result = await History.create({
      ...data,
      key: uuid,
      response: answer,
      user: user_id,
    });

    res.end(JSON.stringify(data));
  } catch (error) {
    throw error;
  }
};

export default chatGptHandler;
