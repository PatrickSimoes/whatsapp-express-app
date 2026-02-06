import type { Request, Response, NextFunction } from 'express';

const formatTimestamp = () => new Date().toISOString();
const colors = {
  reset: '\u001b[0m',
  info: '\u001b[32m',
  warn: '\u001b[33m',
  error: '\u001b[31m',
};

const prefix = (level: string, context: string) =>
  `[WhatsAppApp] ${process.pid} - ${formatTimestamp()}   ${level} [${context}]`;

const log = (level: string, context: string, message: string, meta?: string) => {
  const formatted = `${prefix(level, context)} ${message}`;
  const color = colors[level === 'LOG' ? 'info' : level.toLowerCase() as keyof typeof colors] || colors.info; 
  if (meta) {
    console.log(color + formatted + colors.reset, meta);
  } else {
    console.log(color + formatted + colors.reset);
  }
};

export const logger = {
  info: (context: string, message: string, meta?: string) => log('LOG', context, message, meta),
  warn: (context: string, message: string, meta?: string) => log('WARN', context, message, meta),
  error: (context: string, message: string, meta?: string) => log('ERROR', context, message, meta),
};

const getDurationMs = (start: [number, number]) => {
  const diff = process.hrtime(start);
  return Math.round(diff[0] * 1e3 + diff[1] / 1e6);
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const duration = getDurationMs(start);
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    if (res.statusCode >= 500) {
      logger.error('HTTP', message);
    } else if (res.statusCode >= 400) {
      logger.warn('HTTP', message);
    } else {
      logger.info('HTTP', message);
    }
  });
  next();
};
