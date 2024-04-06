import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const handleGemini = async (req, res) => {
  const { prompt } = req.body;
  const startInstant = performance.now();
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContentStream(prompt);

  let answer = "";
  let latency = 0;
  let starttime = Date.now();
  for await (const chunk of result.stream) {
    if (latency == 0) {
      latency = (Date.now() - starttime) / 1000;
    }
    const chunkText = chunk.text();
    res.write(chunkText);
    answer += chunkText;
  }
  const endInstant = performance.now();

  const prompt_tokens_response = await model.countTokens(prompt);
  const prompt_tokens = prompt_tokens_response.totalTokens;
  const response_tokens_response = await model.countTokens(answer);
  const completion_tokens = response_tokens_response.totalTokens;
  const total_tokens = prompt_tokens + completion_tokens;

  res.end(
    JSON.stringify({
      end: true,
      model: "gemini",
      prompt,
      usage: {
        prompt_tokens,
        completion_tokens,
        total_tokens,
      },
      duration: `${endInstant - startInstant}`,
      latency,
      cost: 0,
    })
  );
};

export default handleGemini;
