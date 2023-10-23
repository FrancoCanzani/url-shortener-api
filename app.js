const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const yup = require('yup');

const dbConnect = require('./db/dbConnect');
const UrlModel = require('./db/urlModel');

require('dotenv').config();

const app = express();
dbConnect();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
// Parses incoming requests with JSON payloads
app.use(express.json());

const schema = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .matches(/^[\w\-]+$/i),
  url: yup.string().trim().url().required(),
});

app.post('/url', async (req, res) => {
  const { slug, url } = req.body;

  try {
    await schema.validate({ slug, url });

    let newSlug = slug;

    if (!newSlug) {
      const { nanoid } = await import('nanoid');
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

app.get('/:id', async (req, res) => {
  const { id: slug } = req.params;
  const decodedSlug = decodeURIComponent(slug); // Decode the URL parameter

  try {
    const url = await UrlModel.findOne({ slug: decodedSlug }); // Use the decodedSlug in the query
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

app.get('/', (req, res) => {
  res.json({
    message: 'URL shortener tooling',
  });
});

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
  });
});

const port = process.env.PORT || 3001;

const server = app.listen(port, async () => {
  console.log(`Example app listening on port ${port}!`);
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
