import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

export const execute = async (prompt) => {
  try {
    const startInstant = performance.now();

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const response = await completion.choices[0].message.content;
    const usage = await completion.usage;

    const endInstant = performance.now();
    return {
      model: "chatgpt",
      prompt,
      response: response,
      usage: usage,
      duration: `${endInstant - startInstant}`,
    };
  } catch (error) {
    throw error;
  }
};
