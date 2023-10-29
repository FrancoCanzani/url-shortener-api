import { nanoid } from 'nanoid';
import { UrlModel } from '../models/urlModel.js';
import yup from 'yup';

const schema = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .matches(/^[\w-]+$/i),
  url: yup
    .string()
    .trim()
    .matches(
      /^(https?:\/\/)?(www\.)?[\w-]+(\.\w+)+([/\w-]+)?(\/)?$/,
      'Please enter a valid URL'
    )
    .required(),
});

export const shortenLink = async (req, res) => {
  const { slug, url } = req.body;

  try {
    await schema.validate({ slug, url });

    let newSlug = slug;

    if (!newSlug) {
      newSlug = nanoid(5);
      console.log('Generated new slug:', newSlug);
    } else {
      const existing = await UrlModel.findOne({ slug });
      if (existing) {
        throw new Error('Slug is already in use 🐌');
      }
    }

    newSlug = newSlug.toLowerCase();

    const newURL = new UrlModel({
      url,
      slug: newSlug,
      clicks: 0,
      date: new Date(),
    });

    await newURL.save();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(newURL);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
