import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import 'dotenv/config';
import { dbConnect } from './db/dbConnect.js';
import { urlRouter } from './routes/urlRouter.js';
import { qrRouter } from './routes/qrRouter.js';
import { redirectRouter } from './routes/redirectRouter.js';
import { validateApiKey } from './middleware/validateApiKey.js';

const app = express();

dbConnect();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
// Parses incoming requests with JSON payloads
app.use(express.json());

// global middleware to validate api key
app.use(validateApiKey);

// routes
app.use('/api/v1/url', urlRouter);
app.use('/api/v1', redirectRouter);
app.use('/api/v1/qr', qrRouter);

app.get('/api/v1', (req, res) => {
  res.json({
    message: 'Clipped API V1',
  });
});

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
    });
  } else {
    res.status(500).json({
      message: 'Internal Server Error',
      stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
    });
  }
  next();
});

const port = process.env.PORT ?? 3001;

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}!`);
});
