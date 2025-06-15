import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerValidate } from "./api/validate.js";

const app = express();
const PORT = 8080;

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponses)

app.get("/api/healthz", middlewareLogResponses, handlerReadiness);
app.get("/admin/metrics", handlerMetrics)
app.post("/admin/reset", handlerReset);
app.post("/api/validate_chirp", handlerValidate);


app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`)
})