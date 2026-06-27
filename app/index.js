'use strict';

const express = require('express');
const promClient = require('prom-client');
const { createLogger, logRequest, logError } = require('./logger');
const { sendLog } = require('./loki');

const app = express();
const PORT = process.env.PORT || 8000;
const logger = createLogger('app');

// ── Prometheus setup ──────────────────────────────────────────────────────────
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register, prefix: 'nodejs_' });

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register],
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

const httpRequestErrors = new promClient.Counter({
  name: 'http_request_errors_total',
  help: 'Total number of HTTP request errors',
  labelNames: ['method', 'route', 'error_type'],
  registers: [register],
});

const activeConnections = new promClient.Gauge({
  name: 'http_active_connections',
  help: 'Number of active HTTP connections',
  registers: [register],
});

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request tracking middleware
app.use((req, res, next) => {
  const start = Date.now();
  activeConnections.inc();

  res.on('finish', () => {
    activeConnections.dec();
    const durationSec = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;
    const labels = { method: req.method, route, status_code: res.statusCode };

    httpRequestDuration.observe(labels, durationSec);
    httpRequestTotal.inc(labels);
    logRequest(req, res, durationSec * 1000);
    sendLog('info', `${req.method} ${req.path} ${res.statusCode}`, {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration_ms: Math.round(durationSec * 1000),
    });
  });

  next();
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    service: 'observability-platform',
    version: process.env.npm_package_version || '1.0.0',
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  const memUsage = process.memoryUsage();
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: {
      rss: memUsage.rss,
      heapTotal: memUsage.heapTotal,
      heapUsed: memUsage.heapUsed,
      external: memUsage.external,
    },
    pid: process.pid,
    timestamp: new Date().toISOString(),
  });
});

app.get('/ready', (req, res) => {
  // Readiness probe — add dependency checks here
  res.status(200).json({ ready: true });
});

// Simulate a slow endpoint for latency testing
app.get('/slow', async (req, res) => {
  const delay = parseInt(req.query.ms) || 500;
  await new Promise((r) => setTimeout(r, Math.min(delay, 5000)));
  res.json({ message: `Responded after ${delay}ms delay` });
});

// Simulate errors for testing error tracking
app.get('/error', (req, res, next) => {
  const err = new Error('Simulated application error');
  err.statusCode = 500;
  next(err);
});

// Simulate CPU load for testing
app.get('/cpu-load', (req, res) => {
  const iterations = parseInt(req.query.n) || 1e7;
  let result = 0;
  for (let i = 0; i < iterations; i++) { result += Math.sqrt(i); }
  res.json({ result, iterations });
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// ── Error handling ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

app.use((err, req, res, _next) => {
  const status = err.statusCode || 500;
  const route = req.route?.path || req.path;
  httpRequestErrors.inc({ method: req.method, route, error_type: err.name || 'Error' });
  logError(err, req);
  sendLog('error', err.message, { path: req.path, stack: err.stack });
  res.status(status).json({ error: err.message, status });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
  sendLog('info', `Server started on port ${PORT}`, { port: PORT });
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received — shutting down gracefully');
  server.close(() => process.exit(0));
});

process.on('uncaughtException', (err) => {
  logError(err);
  sendLog('error', 'Uncaught exception', { message: err.message, stack: err.stack });
  process.exit(1);
});

module.exports = { app, server };
