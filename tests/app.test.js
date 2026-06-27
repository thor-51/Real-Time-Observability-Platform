'use strict';

const request = require('supertest');
const { app, server } = require('../app/index');

afterAll(() => server.close());

describe('GET /', () => {
  it('returns service info', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ service: 'observability-platform', status: 'ok' });
  });
});

describe('GET /health', () => {
  it('returns healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.memory).toBeDefined();
  });
});

describe('GET /ready', () => {
  it('returns ready', async () => {
    const res = await request(app).get('/ready');
    expect(res.status).toBe(200);
    expect(res.body.ready).toBe(true);
  });
});

describe('GET /metrics', () => {
  it('returns prometheus metrics', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.text).toContain('nodejs_');
    expect(res.text).toContain('http_requests_total');
  });
});

describe('GET /error', () => {
  it('returns 500 for simulated error', async () => {
    const res = await request(app).get('/error');
    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});

describe('GET /slow', () => {
  it('responds after delay', async () => {
    const start = Date.now();
    const res = await request(app).get('/slow?ms=100');
    expect(res.status).toBe(200);
    expect(Date.now() - start).toBeGreaterThanOrEqual(90);
  }, 3000);
});

describe('GET unknown route', () => {
  it('returns 404', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.status).toBe(404);
  });
});
