import { GPTTokens } from "gpt-tokens";

const createGPTTokens = (model, role, content) => {
  return new GPTTokens({
    model,
    messages: [{ role, content }],
  });
};
export default createGPTTokens;
