import 'dotenv/config';
import express from 'express';

import { logger, requestLogger } from './shared/logger.js';

const app = express();

app.use(express.json());
app.use(requestLogger);

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

const port = Number(process.env.PORT) || 3000;
const env = process.env.NODE_ENV?.trim() || 'development';

const logStartup = () => {
  const url = `http://localhost:${port}`;

  logger.info('NestFactory', 'Starting Nest-style WhatsApp Express server...');
  logger.info('InstanceLoader', 'Modules dependencies initialized (mock log)');
  logger.info('RoutesResolver', `Listening on ${url} (env: ${env})`);
  logger.info('StartReady', '🚀 Aplicação pronta!');
};

app.listen(port, logStartup);
