📊 Real-Time Observability Platform

A production-inspired monitoring, logging, and observability stack for Node.js applications, integrating Grafana, Prometheus, Loki, and Docker.
https://img.shields.io/badge/License-MIT-yellow.svg
https://img.shields.io/badge/node.js-18.x-green
https://img.shields.io/badge/docker-compose-blue

📖 Overview

Modern applications require more than just functional code—they require deep visibility into their inner workings. This project demonstrates how to build a complete observability stack for a Node.js application, enabling developers and operators to:

Monitor application health and performance metrics.
Track critical runtime statistics in real-time.
Analyze centralized logs for debugging and auditing.
Diagnose issues with correlated metrics and logs.
The entire stack is containerized with Docker Compose, simulating a production-style environment commonly used in modern backend systems and cloud-native architectures.

✨ Features

📈 Metrics Monitoring

Automatically collect and expose critical Node.js runtime metrics, including:

Process CPU and Memory Usage
Heap Utilization (Total, Used, Available)
Event Loop Lag
Active Requests and Handlers
Application Uptime and Restart Count
Node.js Runtime Information
📜 Centralized Logging

Aggregate, store, and analyze application logs from a single, powerful interface:

Structured Logging for better parsing and querying.
Error Tracking to quickly identify failures.
Log Filtering & Searching to pinpoint specific issues.
Real-time Log Streaming for live debugging.
📊 Grafana Dashboards

Visualize all data through beautiful, interactive dashboards:

CPU & Memory Usage Trends
Heap Allocation Patterns
Event Loop Performance
Request Activity Monitoring
Comprehensive Application Health Overview
🐳 Containerized Deployment

The entire stack runs seamlessly using Docker Compose:

Easy Setup with a single command.
Reproducible development and production-like environments.
Simplified Management of all services and their dependencies.
🏗️ System Architecture

The platform is composed of four main services working in concert:

🛠️ Technology Stack

Category	Technology	Purpose
Backend	Node.js, Express.js	Monitored application framework.
Metrics	Prometheus	Time-series database for metrics collection and storage.
Logging	Loki	Horizontally-scalable log aggregation system.
Visualization	Grafana	Analytics and interactive visualization platform.
Orchestration	Docker, Docker Compose	Containerization and service orchestration.
📂 Project Structure

A quick look at the repository layout:

text
Real-Time-Observability-Platform/
├── app/                        # Main application code
│   ├── index.js               # Application entry point
│   └── util.js                # Utility functions (e.g., metrics, logging)
├── grafana/                   # Grafana configuration (future enhancement)
│   ├── dashboards/            # Custom dashboard JSON definitions
│   └── provisioning/          # Datasource and dashboard provisioning
├── screenshots/               # Screenshots of the running system
│   ├── dashboard.png
│   └── logs.png
├── docker-compose.yml         # Defines and runs all services
├── prometheus-config.yml      # Prometheus scrape and storage configuration
├── package.json               # Node.js dependencies
├── package-lock.json
└── README.md                  # This file
🚀 Getting Started

Follow these simple steps to get the platform up and running on your local machine.

Prerequisites

Docker and Docker Compose installed on your system.
Git (to clone the repository).
Installation & Setup

Clone the repository:
bash
git clone https://github.com/thor-51/Real-Time-Observability-Platform.git
cd Real-Time-Observability-Platform
Start all services:
The docker-compose.yml file orchestrates everything. Launch it with:
bash
docker compose up -d
This command runs the services in the background. Use docker compose logs -f to follow the logs.
Verify running containers:
bash
docker ps
🌐 Access the Services

Once started, you can access the different components via your browser:

Service	URL	Default Credentials
Express Application	http://localhost:8000	N/A
Prometheus	http://localhost:9090	N/A
Grafana	http://localhost:3000	admin / admin
Note: For Grafana, you will be prompted to change the default password upon first login.
📈 Dashboard & Metrics

The Grafana dashboards are pre-configured to visualize key metrics that are critical for understanding your application's health:

Application Metrics

CPU: Process CPU usage, spikes, and average utilization.
Memory: Heap total, used, available, and overall process memory.
Runtime: Event loop lag, active handlers, active requests, and Node.js version.
Requests: Request counts and service availability.
Log Analysis

Using Loki, you can:

Search logs by keywords or specific error codes.
Filter logs by severity levels (e.g., error, warn).
Correlate log events with performance metrics to diagnose root causes.
🎯 Use Cases & Learning Outcomes

This project is an excellent practical example for concepts central to:

Backend Engineering & SRE: Implementing production-ready monitoring.
DevOps: Managing a microservices monitoring stack with Docker.
Cloud Infrastructure: Understanding service discovery and data collection.
Performance Analysis: Identifying bottlenecks and memory leaks.
Key Learnings

Building this project provided hands-on experience with:

Configuring and integrating Prometheus, Loki, and Grafana.
Exposing custom application metrics in Node.js.
Containerizing a multi-service environment with Docker Compose.
Designing dashboards for effective system monitoring.
🔮 Future Improvements

The platform can be extended in numerous ways:

Distributed Tracing: Integrate Jaeger or Tempo for end-to-end request tracing.
Alerting: Add Alertmanager to send notifications (e.g., email, Slack) for critical conditions.
Orchestration: Deploy on Kubernetes using Helm charts.
Instrumentation: Adopt OpenTelemetry for standardized telemetry data collection.
Custom Metrics: Add business-specific metrics (e.g., user signups, transactions).
CI/CD: Automate the deployment and testing of the monitoring stack.
🤝 Contributing

Contributions, suggestions, and improvements are welcome!
If you have an idea or find a bug, please feel free to open an issue or submit a pull request.

Fork the Project
Create your Feature Branch (git checkout -b feature/AmazingFeature)
Commit your Changes (git commit -m 'Add some AmazingFeature')
Push to the Branch (git push origin feature/AmazingFeature)
Open a Pull Request
📄 License

Distributed under the MIT License. See LICENSE (if added) for more information.

⭐ Support

If you found this project useful, please consider giving it a star on GitHub! It helps others discover the project and motivates further improvements.

Built with ❤️ by Aryan Vatsal (thor-51)
