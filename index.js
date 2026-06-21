const express = require("express");
const responseTime = require("response-time");
const client = require("prom-client"); //Metric Collection

const { createLogger, transports } = require("winston");
const LokiTransport = require("winston-loki");
const options = {
  transports: [
    new LokiTransport({
        labels: {
            appName: "express",
        },
      host: "http://127.0.0.1:3100"
    })
  ]
};
const logger = createLogger(options);

const { dosomeHeavyTask } = require("./util"); 

const app = express();
const PORT = process.env.PORT || 8000;

const collectDefaultMetrics = client.collectDefaultMetrics;

//Custom Metric
const reqResTime = new client.Histogram({
    name: "http_express_req_res_time",
    help: "This tells how much time is taken by req and res",
    labelNames: ["method", "route", "status_code"],
    buckets: [1, 50, 100, 200, 400, 500, 800, 1000, 2000],
});

const totalreqCounter = new client.Counter({
    name: "total_req",
    help: "Tells total req",
});

//Middleware
app.use(responseTime((req, res, time) => {
    totalreqCounter.inc();
    reqResTime
    .labels({
        method: req.method,
        route: req.route?.path || req.path,
        status_code: res.statusCode,
    })
    .observe(time);
}));

collectDefaultMetrics({ register: client.register });

app.get("/", (req, res) => {
    logger.info("Req came on / route");
    return res.json({ message: `Hello from Express!`});
});

app.get("/slow", async (req, res) => {
    try {
        logger.info("Req came on /slow route");
        const timeTaken = await dosomeHeavyTask();
        return res.json({
            status: "success",
            message: `Heavy task completed in ${timeTaken}ms`,
        });
    } catch(error) {
        logger.error(error.message);
        return res
        .status(500)
        .json({ status: "Error", error: "Internal Server Error" });
    }
});

app.get("/metrics", async (req, res) => {
    res.setHeader('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server started at http://localhost:${PORT}`);
});