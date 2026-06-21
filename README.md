# 📊 Node.js Observability Stack

> Production-inspired monitoring, logging, and observability platform for Node.js applications using Grafana, Prometheus, Loki, and Docker.

<p align="center">
  <img src="screenshots/dashboard.png" width="100%" />
</p>

## 🚀 Overview

Modern applications require more than just functional code—they require visibility.

This project demonstrates how to build a complete observability stack for a Node.js application, enabling developers to monitor application health, track performance metrics, analyze logs, and diagnose issues in real time.

The stack integrates:

* 📈 Prometheus for metrics collection
* 📊 Grafana for visualization and dashboards
* 📜 Loki for centralized log aggregation
* 🚀 Express.js as the monitored application
* 🐳 Docker Compose for orchestration

The goal is to simulate a production-style monitoring environment commonly used in modern backend systems and cloud-native architectures.

---

# ✨ Features

### 📈 Metrics Monitoring

Monitor critical Node.js runtime metrics such as:

* Process CPU Usage
* Process Memory Usage
* Heap Utilization
* Event Loop Lag
* Active Requests
* Application Uptime
* Process Restart Count
* Node.js Runtime Information

---

### 📜 Centralized Logging

Aggregate and analyze logs from a centralized dashboard.

Capabilities include:

* Structured application logs
* Error tracking
* Log filtering
* Log searching
* Real-time log streaming

---

### 📊 Grafana Dashboards

Visualize application behavior through interactive dashboards.

Current dashboards include:

* CPU Usage Trends
* Memory Consumption
* Heap Allocation Patterns
* Event Loop Performance
* Request Activity Monitoring
* Application Health Metrics

---

### 🐳 Containerized Deployment

Entire stack runs using Docker Compose.

Benefits:

* Easy setup
* Reproducible environment
* Local development support
* Production-like deployment architecture

---

# 🏗️ System Architecture

```text
                ┌──────────────────┐
                │   Node.js App    │
                │    (Express)     │
                └────────┬─────────┘
                         │
         ┌───────────────┼────────────────┐
         │                                │
         ▼                                ▼

┌──────────────────┐          ┌──────────────────┐
│    Prometheus    │          │      Loki        │
│ Metrics Storage  │          │  Log Storage     │
└────────┬─────────┘          └────────┬─────────┘
         │                              │
         └──────────────┬───────────────┘
                        ▼

               ┌────────────────┐
               │    Grafana     │
               │ Visualization  │
               └────────────────┘
```

---

# 🛠️ Technology Stack

## Backend

* Node.js
* Express.js

## Monitoring

* Prometheus

## Logging

* Loki

## Visualization

* Grafana

## Containerization

* Docker
* Docker Compose

---

# 📂 Project Structure

```text
nodejs-observability-stack/
│
├── app/
│   ├── server.js
│   ├── routes/
│   └── middleware/
│
├── prometheus/
│   └── prometheus.yml
│
├── loki/
│   └── config.yml
│
├── grafana/
│   ├── dashboards/
│   └── provisioning/
│
├── screenshots/
│   ├── dashboard.png
│   └── logs.png
│
├── docker-compose.yml
│
└── README.md
```

---

# ⚡ Getting Started

## Clone Repository

```bash
git clone https://github.com/thor-51/nodejs-observability-stack.git
cd nodejs-observability-stack
```

---

## Start Services

```bash
docker compose up -d
```

Verify running containers:

```bash
docker ps
```

---

# 🌐 Access Services

| Service     | URL                   |
| ----------- | --------------------- |
| Express App | http://localhost:8000 |
| Prometheus  | http://localhost:9090 |
| Grafana     | http://localhost:3000 |
| Loki        | Internal Service      |

---

# 📈 Dashboard Metrics

The dashboard currently tracks:

### CPU Metrics

* Process CPU Usage
* CPU Spikes
* Average CPU Utilization

### Memory Metrics

* Heap Total
* Heap Used
* Heap Available
* Process Memory Usage

### Runtime Metrics

* Event Loop Lag
* Active Handlers
* Active Requests
* Node.js Version

### Application Metrics

* Request Counts
* Response Monitoring
* Service Availability

---

# 🔍 Log Analysis

Using Loki, developers can:

* Search logs by keywords
* Filter logs by severity
* Investigate failures
* Correlate logs with metrics
* Monitor application behavior in real time

---

# 🎯 Use Cases

This project demonstrates concepts used in:

* Backend Engineering
* Site Reliability Engineering (SRE)
* DevOps
* Cloud Infrastructure
* Distributed Systems
* Production Monitoring

---

# 📸 Screenshots

## Grafana Dashboard

![Grafana Dashboard](screenshots/dashboard.png)

## Loki Logs

![Loki Logs](screenshots/logs.png)

---

# 📚 Key Learnings

Building this project provided practical experience with:

* Application Monitoring
* Metrics Collection
* Log Aggregation
* Dashboard Design
* Docker Networking
* Production Observability Patterns
* Performance Analysis
* Infrastructure Monitoring

---

# 🔮 Future Improvements

* Distributed Tracing with Jaeger
* Alerting with Alertmanager
* Kubernetes Deployment
* OpenTelemetry Integration
* Custom Business Metrics
* CI/CD Integration

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

Feel free to open an issue or submit a pull request.

---

# ⭐ Support

If you found this project useful, consider giving it a star.

It helps others discover the project and motivates further improvements.
