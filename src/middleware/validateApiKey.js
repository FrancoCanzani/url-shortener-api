function validateApiKey(req, res, next) {
  const apiKey = req.headers.authorization;
  const key = process.env.API_KEY;

  if (!apiKey || apiKey !== key) {
    return res.status(401).json({ message: 'Unauthorized. Invalid API key.' });
  }

  next();
}

export { validateApiKey };
