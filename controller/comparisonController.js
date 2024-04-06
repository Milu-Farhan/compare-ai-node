const comparisonController = async (req, res) => {
  const { prompt, models } = req.body;

  const promises = [];
  for (const model of models) {
    const modelPath = `../ai_models/${model}.js`;
    const { execute } = await import(modelPath);
    promises.push(execute(prompt));
  }

  const result = await Promise.all(promises);
  res.json({
    success: true,
    data: result,
  });
};

export default comparisonController;
