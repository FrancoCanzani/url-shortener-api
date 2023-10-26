import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import 'dotenv/config';
import { dbConnect } from './db/dbConnect.js';
import { urlRouter } from './routes/urlRouter.js';
import { slugIdRouter } from './routes/slugIdRouter.js';
import { qrRouter } from './routes/qrRouter.js';

const app = express();

dbConnect();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
// Parses incoming requests with JSON payloads
app.use(express.json());

// routes
app.use('/api/v1/url', urlRouter);
app.use('/api/v1', slugIdRouter);
app.use('/api/v1/qr', qrRouter);

app.get('/api/v1', (req, res) => {
  res.json({ message: 'Clipped Api' });
});

app.use((error, req, res) => {
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
});

const port = process.env.PORT ?? 3001;

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}!`);
});
