'use strict';

const http = require('http');

const LOKI_HOST = process.env.LOKI_HOST || 'loki';
const LOKI_PORT = parseInt(process.env.LOKI_PORT) || 3100;
const APP_NAME = process.env.APP_NAME || 'observability-platform';
const ENV = process.env.NODE_ENV || 'development';

/**
 * Send a log entry to Loki via the push API.
 * Silently drops on failure so app stays healthy if Loki is down.
 */
function sendLog(level, message, extra = {}) {
  const timestamp = `${Date.now() * 1_000_000}`; // nanoseconds
  const line = JSON.stringify({ level, message, ...extra, timestamp: new Date().toISOString() });

  const body = JSON.stringify({
    streams: [
      {
        stream: { app: APP_NAME, level, env: ENV },
        values: [[timestamp, line]],
      },
    ],
  });

  const options = {
    hostname: LOKI_HOST,
    port: LOKI_PORT,
    path: '/loki/api/v1/push',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  const req = http.request(options);
  req.on('error', () => {}); // swallow — Loki may not be up yet
  req.write(body);
  req.end();
}

module.exports = { sendLog };
