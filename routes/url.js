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

urlRouter.get('/:id', async (req, res) => {
  const { id: slug } = req.params;
  console.log(req.params);

  const decodedSlug = decodeURIComponent(slug); // Decode the URL parameter
  console.log(decodedSlug);
  try {
    const url = await UrlModel.findOne({ slug: decodedSlug }); // Use the decodedSlug in the query
    console.log(url);
    if (url) {
      await UrlModel.update(
        { slug: decodedSlug },
        { $inc: { clicks: 1 } } // Use $inc to increment clicks by 1
      );
      res.redirect(url.url);
    } else {
      res.redirect(`/?error=${decodedSlug} not found`);
    }
  } catch (error) {
    res.redirect('/?error=Link not found');
  }
});
