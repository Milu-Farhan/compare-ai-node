import OpenAI from "openai";
import createGPTTokens from "../utils/calculateChatgptToken.js";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const handleChatgpt = async (req, res) => {
  try {
    const { prompt } = req.body;
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
      answer += part.choices[0]?.delta.content;
      res.write(part.choices[0]?.delta.content || "");
    }

    const endInstant = performance.now();

    const prompt_tokens = createGPTTokens("gpt-3.5-turbo", "user", prompt);
    const completion_tokens = createGPTTokens(
      "gpt-3.5-turbo",
      "assistant",
      answer
    );

    res.end(
      JSON.stringify({
        model: "chatgpt",
        prompt,
        usage: {
          prompt_tokens: prompt_tokens.usedTokens,
          completion_tokens: completion_tokens.usedTokens,
          total_tokens: prompt_tokens.usedTokens + completion_tokens.usedTokens,
        },
        latency,
        duration: `${endInstant - startInstant}`,
        cost: prompt_tokens.usedUSD + completion_tokens.usedUSD,
      })
    );
  } catch (error) {
    throw error;
  }
};

export default handleChatgpt;
