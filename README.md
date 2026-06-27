# 📊 Real-Time Observability Platform

A production-grade monitoring, logging, and alerting stack for Node.js applications built with **Grafana**, **Prometheus**, **Loki**, **Alertmanager**, and **Docker Compose**.

![CI](https://github.com/thor-51/Real-Time-Observability-Platform/actions/workflows/ci.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node.js](https://img.shields.io/badge/node.js-20.x-green)
![Docker](https://img.shields.io/badge/docker-compose-blue)

---

## 📖 Overview

This project demonstrates a complete observability stack you'd actually use in production. One `docker compose up` gives you:

- **Metrics** — Prometheus scrapes your Node.js app every 5s; Grafana visualizes them
- **Logs** — Structured JSON logs shipped to Loki; searchable in Grafana
- **Alerting** — Prometheus alerting rules + Alertmanager (pre-wired for Slack/email)
- **Pre-built dashboards** — Auto-provisioned, no manual setup in Grafana

---

## ✨ Features

### 📈 Metrics (Prometheus)
- HTTP request rate, latency percentiles (p50/p90/p95/p99), error rate
- Node.js heap (total/used), RSS, external memory
- CPU usage, event loop lag
- Active connections, uptime, GC stats (via `prom-client` default metrics)

### 📜 Centralized Logging (Loki)
- Structured JSON logging via Winston
- Direct Loki push — no log shipper (Promtail) needed
- Log levels routed to separate Grafana panels
- Log retention: 7 days (configurable)

### 📊 Grafana Dashboards (Auto-provisioned)
- **Overview row**: App status, uptime, request rate, heap %, p95 latency, error rate
- **HTTP Traffic**: Request rate by status code, latency percentiles over time
- **Memory & Heap**: Heap used vs. total, RSS, external
- **CPU & Event Loop**: CPU %, event loop lag + p99
- **Logs**: Live app logs + error-only log panel

### 🔔 Alerting (Alertmanager)
Pre-configured rules for:
- App down (30s)
- Heap > 85%
- p95 latency > 1s
- Error rate spike
- CPU > 80% sustained 3m

### 🐳 Docker
- Multi-stage `Dockerfile` (deps → runtime), non-root user, healthcheck
- All services have health checks and `restart: unless-stopped`
- Named volumes for Prometheus, Grafana, Loki data persistence

---

## 🏗️ Architecture

```
┌─────────────┐    /metrics     ┌──────────────┐
│  Node.js    │◄───────────────│  Prometheus  │
│  Express    │                 └──────┬───────┘
│  :8000      │   HTTP push            │
│             │──────────────►  ┌──────▼───────┐    ┌─────────────────┐
└─────────────┘                 │     Loki     │    │   Alertmanager  │
                                │    :3100     │    │     :9093       │
                                └──────┬───────┘    └────────▲────────┘
                                       │                     │ alerts
                                ┌──────▼───────────────────┐ │
                                │         Grafana          ├─┘
                                │          :3000           │
                                └──────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Docker + Docker Compose v2
- Git

### Setup

```bash
git clone https://github.com/thor-51/Real-Time-Observability-Platform.git
cd Real-Time-Observability-Platform

# Copy and (optionally) edit env vars
cp .env.example .env

# Start all services
docker compose up -d

# Follow logs
docker compose logs -f app
```

### Access

| Service       | URL                        | Credentials       |
|---------------|----------------------------|-------------------|
| App           | http://localhost:8000      | —                 |
| Prometheus    | http://localhost:9090      | —                 |
| Grafana       | http://localhost:3000      | admin / admin     |
| Alertmanager  | http://localhost:9093      | —                 |
| Loki          | http://localhost:3100      | —                 |

> Grafana opens with the **Node.js Observability Platform** dashboard already loaded. No manual datasource or dashboard setup required.

---

## 📂 Project Structure

```
Real-Time-Observability-Platform/
├── app/
│   ├── index.js              # Express app, routes, metrics middleware
│   ├── logger.js             # Winston structured logger
│   └── loki.js               # Loki HTTP push client
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/      # Auto-connects Prometheus + Loki
│   │   └── dashboards/       # Auto-loads dashboards from /grafana/dashboards
│   └── dashboards/
│       └── nodejs-overview.json   # Full observability dashboard
├── tests/
│   └── app.test.js           # Jest + Supertest integration tests
├── .github/workflows/
│   └── ci.yml                # GitHub Actions: lint, test, docker build
├── docker-compose.yml        # All 5 services
├── Dockerfile                # Multi-stage Node.js image
├── prometheus.yml            # Prometheus scrape config
├── alerts.yml                # Alerting rules
├── loki-config.yml           # Loki storage + retention config
├── alertmanager.yml          # Alertmanager routing (Slack/email ready)
├── .env.example              # All configurable env vars
└── LICENSE
```

---

## 🛠️ Development

```bash
# Install deps
npm install

# Run locally (without Docker)
npm run dev

# Run tests
npm test

# Rebuild Docker image after code changes
docker compose build app && docker compose up -d app
```

### Test Endpoints

| Route         | Purpose                                   |
|---------------|-------------------------------------------|
| `GET /`       | Service info + uptime                     |
| `GET /health` | Health probe with memory stats            |
| `GET /ready`  | Readiness probe                           |
| `GET /metrics`| Prometheus metrics                        |
| `GET /slow`   | Simulate latency (`?ms=500`)              |
| `GET /error`  | Trigger a 500 error (test alerting)       |
| `GET /cpu-load` | CPU stress test (`?n=10000000`)        |

---

## 🔔 Configuring Alerts

Edit `alertmanager.yml` and uncomment/fill in your receiver:

```yaml
# Slack example
- name: 'slack'
  slack_configs:
    - api_url: 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL'
      channel: '#alerts'
```

Then reload: `docker compose restart alertmanager`

---

## 🔮 Future Improvements

- [ ] Distributed tracing with **Grafana Tempo** + OpenTelemetry
- [ ] Kubernetes deployment with Helm charts
- [ ] Promtail for file-based log collection
- [ ] Custom business metrics (signups, transactions)
- [ ] Grafana OnCall integration

---

## 📄 License

MIT — see [LICENSE](LICENSE)
