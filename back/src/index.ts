import express, { Response } from 'express';
import { HttpErrorBase } from './errors';
import { env } from './env';

const PORT = env.port;
export const app = express();

app.use(express.json());

app.use('/', (req, res, next) => {
  console.log(`[${req.method}] - ${req.path}`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  next();
});

export const handleError = (err: unknown, res: Response) => {
  if (err instanceof HttpErrorBase) {
    return res.status(err.status).send(err.description);
  }

  res.status(500).send();
};

import './routes/clips';
import './routes/login';
import './routes/videoPosting';
import './routes/channels';

app.listen(PORT, () => {
  console.log(`Started server at http://localhost:${PORT}`);
});