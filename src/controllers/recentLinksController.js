import { UrlModel } from '../models/urlModel.js';

export const getRecentLinks = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    if (limit <= 0) {
      return res
        .status(400)
        .json({ error: 'Limit must be a positive number.' });
    }

    const links = await UrlModel.find()
      .sort({ createdAt: -1 }) // sort by createdAt in descending order
      .limit(limit) // use the limit from the query parameter
      .exec();

    res.status(200).json(links);
  } catch (error) {
    next(error);
  }
};
