import { Router } from 'express';
import { nanoid } from 'nanoid';
import yup from 'yup';
import { UrlModel } from '../db/urlModel.js';

export const urlRouter = Router();

const schema = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .matches(/^[\w-]+$/i),
  url: yup.string().trim().url().required(),
});

urlRouter.post('/', async (req, res) => {
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
        console.error('Error: Slug in use 🐌.');
        throw new Error('Slug in use 🐌.');
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
});
