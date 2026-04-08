import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import episodesRouter from './routes/episodes';

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    methods: ['GET'],
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/episodes', episodesRouter);

app.listen(PORT, () => {
  console.log(`EchoStream API running on port ${PORT}`);
});

export default app;
