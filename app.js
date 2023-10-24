import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import 'dotenv/config';
import { dbConnect } from './db/dbConnect.js';

// routes
import { urlRouter } from './routes/url.js';

const app = express();

dbConnect();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
// Parses incoming requests with JSON payloads
app.use(express.json());

app.use('/url', urlRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'URL shortener tooling',
  });
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

const server = app.listen(port, async () => {
  console.log(`Example app listening on port ${port}!`);
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
