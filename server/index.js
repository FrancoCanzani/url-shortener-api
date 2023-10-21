const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { schema } = require('../utils/schema');
const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.post('/url', async (req, res) => {
  const { slug, url } = req.body;

  try {
    await schema.validate({
      slug,
      url,
    });

    let newSlug = slug; // Assign the value to a new variable
    if (!newSlug) {
      const { nanoid } = await import('nanoid');
      newSlug = nanoid(5);
    }
    newSlug = newSlug.toLowerCase(); // Corrected toLowerCase method

    res.json({
      slug,
      url,
    });
  } catch (error) {
    res.redirect(`/?error=Link not found`);
  }
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

app.get('/', (req, res) => {
  res.json({
    message: 'URL shortener tooling',
  });
});

const port = process.env.Port || 3001;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
