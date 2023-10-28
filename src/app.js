import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';
import { dbConnect } from './db/dbConnect.js';
import { linkRouter } from './routes/linkRouter.js';
import { qrRouter } from './routes/qrRouter.js';
import { redirectRouter } from './routes/redirectRouter.js';
import { validateApiKey } from './middleware/validateApiKey.js';
import linksRouter from './routes/linksRouter.js';

const app = express();

dbConnect();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
// Parses incoming requests with JSON payloads
app.use(express.json());

// Create a rate limiter with desired settings
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiter
app.use('/api', limiter);

// routes
app.use('/api/v1/links', validateApiKey, linkRouter);
app.use('/api/v1/links', validateApiKey, linksRouter);
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
