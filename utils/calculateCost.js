const calculateCost = (total_price, total_token, current_tokens) => {
  const costPerToken = total_price / total_token;
  const cost = costPerToken * current_tokens;
  const trimmedCost = Number(cost.toFixed(8));
  return trimmedCost;
};

export default calculateCost;
