import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { dbConnect } from './db/dbConnect.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// routes
import { urlRouter } from './routes/urlRouter.js';
import { slugIdRouter } from './routes/slugIdRouter.js';

const app = express();

dbConnect();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
// Parses incoming requests with JSON payloads
app.use(express.json());

app.use('/url', urlRouter);
app.use('/', slugIdRouter);

// Use path.dirname to get the directory name
app.use('/', express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
