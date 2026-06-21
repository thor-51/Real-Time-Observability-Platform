# 📊 Real-Time Observability Platform

A lightweight Node.js/Express service instrumented for observability — exposing Prometheus metrics out of the box and shipping structured logs to Loki, with Prometheus wired up via Docker Compose.

## Overview

This repo is a small, hands-on example of instrumenting a Node.js application for monitoring instead of bolting observability on as an afterthought. The Express server exposes:

- A Prometheus-compatible `/metrics` endpoint with default Node.js runtime metrics plus two custom metrics (a request counter and a request-duration histogram).
- Structured logs (via Winston) shipped to Loki.
- A `/slow` route that simulates variable-latency work and randomly throws errors, so there's actually something interesting to look at on a dashboard.

Prometheus itself is started via Docker Compose, scraping the app's `/metrics` endpoint on an interval.

### Dashboard Preview

A Grafana dashboard built on top of this app's metrics, tracking process CPU usage, event loop lag, memory and heap detail (total/used/available), active handlers, process restart count, and Node.js version:
<img width="2886" height="1660" alt="WhatsApp Image 2026-06-09 at 22 17 18" src="https://github.com/user-attachments/assets/c27cc418-ffd9-4bd9-95f4-ca28b8964bc8" />

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Application | Node.js, Express 5 | HTTP server being monitored |
| Metrics | prom-client | Collects and exposes Prometheus metrics from the app |
| Request timing | response-time | Middleware that measures request duration |
| Logging | Winston + winston-loki | Structured logging, shipped to Loki |
| Metrics storage | Prometheus | Scrapes and stores time-series metrics |
| Orchestration | Docker, Docker Compose | Runs the Prometheus container |

## Project Structure

```
Real-Time-Observability-Platform/
├── index.js               # Express app: routes, metrics, logging setup
├── util.js                # dosomeHeavyTask() helper used by the /slow route
├── package.json           # Dependencies (express, prom-client, response-time, winston, winston-loki)
├── package-lock.json
├── docker-compose.yml      # Spins up the Prometheus container
├── prometheus-config.yml   # Prometheus scrape configuration
└── README.md
```

## Prerequisites

- Node.js 18 or later
- Docker and Docker Compose
- (Optional) A running Loki instance if you want to actually see the shipped logs somewhere

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/thor-51/Real-Time-Observability-Platform.git
cd Real-Time-Observability-Platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Point Prometheus at your app

`prometheus-config.yml` ships with a scrape target hardcoded to a specific machine's local network IP (`172.20.10.7:8000`). That address is specific to the original author's network and almost certainly won't reach your machine. Open `prometheus-config.yml` and change the target to wherever your Express app will actually be reachable from the Prometheus container, for example:

```yaml
global:
  scrape_interval: 4s

scrape_configs:
  - job_name: prometheus
    static_configs:
      - targets: ["host.docker.internal:8000"]
```

`host.docker.internal:8000` works out of the box on Docker Desktop (Mac/Windows). On Linux, use your machine's actual LAN IP instead (find it with `ip addr` or `hostname -I`).

### 4. Start the Express app

```bash
node index.js
```

You should see:

```
Express server started at http://localhost:8000
```

### 5. Start Prometheus

```bash
docker compose up -d
```

This builds and runs the `prom-server` container defined in `docker-compose.yml`, mounting `prometheus-config.yml` into it and exposing it on port `9090`.

### 6. Verify it's working

- App: [http://localhost:8000](http://localhost:8000)
- Raw metrics: [http://localhost:8000/metrics](http://localhost:8000/metrics)
- Prometheus UI: [http://localhost:9090](http://localhost:9090) — check **Status → Targets** to confirm the `prometheus` job is `UP`.

## Available Routes

| Method | Route | Description |
|---|---|---|
| GET | `/` | Returns a simple JSON greeting; logs an info message. |
| GET | `/slow` | Simulates a variable-latency task (100ms–2.5s) via `util.js`. Has roughly a 1-in-8 chance of throwing a random error (`DB Payment Failure`, `DB Server is down`, `Access Denied`, or `Not Found Error`) to exercise error logging and metrics. |
| GET | `/metrics` | Exposes metrics in Prometheus exposition format for scraping. |

## Metrics Exposed

- **Default Node.js process metrics** (via `prom-client`'s `collectDefaultMetrics`): CPU usage, memory/heap usage, event loop lag, active handles, GC stats, etc.
- **`total_req`** — Counter. Total number of requests received.
- **`http_express_req_res_time`** — Histogram. Request duration in ms, labeled by `method`, `route`, and `status_code`.

Hit `/` and `/slow` a few times, then check `/metrics` or query `http_express_req_res_time` in the Prometheus UI to see them populate.

## Logging to Loki (Optional)

The app is configured to ship logs via `winston-loki` to `http://127.0.0.1:3100`. Loki isn't included in `docker-compose.yml`, so if you want to actually receive those logs, run a Loki container yourself:

```bash
docker run -d --name loki -p 3100:3100 grafana/loki:2.9.0 -config.file=/etc/loki/local-config.yaml
```

If the Express app and Loki container can't reach each other on `127.0.0.1`, update the `host` value in the `LokiTransport` config in `index.js` accordingly (e.g. to `host.docker.internal` if Loki is running in Docker and the app is running on your host machine).

## Visualizing with Grafana (Optional)

Grafana isn't part of this repo's Docker Compose setup, but it's easy to add on top of what's already running:

```bash
docker run -d --name grafana -p 3000:3000 grafana/grafana
```

Then open [http://localhost:3000](http://localhost:3000) (default login `admin` / `admin`, which it will prompt you to change), and add two data sources:

- **Prometheus**: `http://host.docker.internal:9090` (or your host's LAN IP if not on Docker Desktop)
- **Loki**: `http://host.docker.internal:3100` (if you started Loki as above)

From there you can build panels against `http_express_req_res_time`, `total_req`, the default Node.js metrics, and query/filter logs by error level straight from Loki.

## Known Limitations

- `docker-compose.yml` currently only provisions Prometheus — Loki and Grafana need to be run separately as shown above.
- `prometheus-config.yml` ships with a scrape target hardcoded to a specific local network IP that will need to be changed for your machine.
- There's no `start` script in `package.json` — run the app directly with `node index.js`.
- `node_modules` is committed to the repository.

## Roadmap

- Add Loki and Grafana as services in `docker-compose.yml` so the full stack comes up with one command.
- Add a `.gitignore` and stop committing `node_modules`.
- Add provisioned Grafana dashboards (JSON definitions) instead of manual setup.
- Add Alertmanager for threshold-based alerts (e.g. error rate, latency).
- Containerize the Express app itself alongside the observability stack.
- Add distributed tracing (OpenTelemetry + Jaeger/Tempo).

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## License

`package.json` specifies the **ISC** license. No `LICENSE` file is currently included in the repository.
