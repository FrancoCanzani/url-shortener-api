const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const yup = require('yup');
const monk = require('monk');

require('dotenv').config();

const db = monk(process.env.MONGO_URL);
const urls = db.get('urls');
urls.createIndex('slug');
urls.createIndex({ slug: 1 }, { index: true });

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

const schema = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .matches(/^[\w\-]+$/i),
  url: yup.string().trim().url().required(),
});

app.post('/url', async (req, res) => {
  console.log('POST request received at /url');

  const { slug, url } = req.body;

  try {
    await schema.validate({
      slug,
      url,
    });

    let newSlug = slug;
    if (!newSlug) {
      const { nanoid } = await import('nanoid');
      newSlug = nanoid(5);
    } else {
      const existing = await urls.findOne({ slug });
      if (existing) {
        throw new Error('Slug in use 🐌.');
      }
    }

    newSlug = newSlug.toLowerCase();

    const newURL = {
      url,
      slug,
      clicks: 0,
    };

    const created = await urls.insert(newURL);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(created);
  } catch (error) {
    console.error('Validation Error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/:id', async (req, res) => {
  const { id: slug } = req.params;

  try {
    const url = await urls.findOne({ slug });
    if (url) {
      res.redirect(url.url);
    }
    res.redirect(`/?error=${slug} in use`);
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

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
