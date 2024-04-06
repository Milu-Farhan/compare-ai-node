import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const execute = async (prompt) => {
  try {
    const startInstant = performance.now();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const endInstant = performance.now();

    const prompt_tokens_response = await model.countTokens(prompt);
    const prompt_tokens = prompt_tokens_response.totalTokens;
    const response_tokens_response = await model.countTokens(text);
    const completion_tokens = response_tokens_response.totalTokens;
    const total_tokens = prompt_tokens + completion_tokens;

    return {
      model: "gemini",
      response: text,
      prompt,
      usage: {
        prompt_tokens,
        completion_tokens,
        total_tokens,
      },
      duration: `${endInstant - startInstant}`,
    };
  } catch (error) {
    return error;
  }
};
