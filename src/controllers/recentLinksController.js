import { UrlModel } from '../models/urlModel.js';

export const getRecentLinks = async (req, res, next) => {
  try {
    const links = await UrlModel.find()
      .sort({ createdAt: -1 }) // sort by createdAt in descending order
      .limit(20) // limit the number of documents to 20
      .exec();

    res.status(200).json(links);
  } catch (error) {
    next(error);
  }
};
