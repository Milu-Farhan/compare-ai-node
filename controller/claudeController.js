import Anthropic from "@anthropic-ai/sdk";
import mongoose from "mongoose";
import Models from "../models/modelsModel.js";
import History from "../models/historyModel.js";
import calculateCost from "../utils/calcualteCost.js";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const claudeHandler = async (req, res) => {
  const { prompt, uuid } = req.body;
  const claudeModelInfo = await Models.find({ model_key: "claude" });

  let starttime = Date.now();
  let latency = 0;
  let timeoutId = null;
  const startInstant = performance.now();
  const stream = anthropic.messages
    .stream({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    })
    .on("text", (text) => {
      if (latency === 0) latency = (Date.now() - starttime) / 1000;
      res.write(text);
    });

  const message = await stream.finalMessage();

  const endInstant = performance.now();

  const input_tokens = message.usage.input_tokens;
  const input_cost = calculateCost(
    claudeModelInfo[0].input_cost[0].price,
    claudeModelInfo[0].input_cost[0].token,
    input_tokens
  );

  const output_tokens = message.usage.output_tokens;
  const output_cost = calculateCost(
    claudeModelInfo[0].output_cost[0].price,
    claudeModelInfo[0].output_cost[0].token,
    output_tokens
  );

  const total_tokens = input_tokens + output_tokens;
  const total_cost = Number((input_cost + output_cost).toFixed(8));

  const data = {
    modal_name: "Claude 3 Opus",
    model_key: "claude",
    prompt,
    latency,
    time_taken: `${endInstant - startInstant}`,
    input_tokens,
    output_tokens,
    total_tokens,
    cost: total_cost,
  };

  const user_id = new mongoose.Types.ObjectId(req.user);

  const result = await History.create({
    ...data,
    key: uuid,
    response: message.content[0].text,
    user: user_id,
  });

  res.end(JSON.stringify(data));
};

export default claudeHandler;
