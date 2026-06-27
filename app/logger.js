'use strict';

const { createLogger: winstonCreateLogger, format, transports } = require('winston');
const { combine, timestamp, errors, json, colorize, printf } = format;

const isDev = process.env.NODE_ENV !== 'production';

const devFormat = printf(({ level, message, timestamp: ts, service, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${ts} [${service}] ${level}: ${message}${metaStr}`;
});

function createLogger(service = 'app') {
  return winstonCreateLogger({
    level: process.env.LOG_LEVEL || 'info',
    defaultMeta: { service },
    format: combine(
      timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
      errors({ stack: true }),
      isDev
        ? combine(colorize(), devFormat)
        : json()
    ),
    transports: [new transports.Console()],
    exitOnError: false,
  });
}

const appLogger = createLogger('app');

function logRequest(req, res, durationMs) {
  const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
  appLogger[level]('HTTP request', {
    method: req.method,
    path: req.path,
    status: res.statusCode,
    duration_ms: Math.round(durationMs),
    user_agent: req.get('User-Agent'),
    ip: req.ip,
  });
}

function logError(err, req = null) {
  const meta = {
    error: err.message,
    stack: err.stack,
    name: err.name,
  };
  if (req) {
    meta.method = req.method;
    meta.path = req.path;
  }
  appLogger.error('Application error', meta);
}

module.exports = { createLogger, logRequest, logError };
