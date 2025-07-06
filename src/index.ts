import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import { middlewareErrorHandler, middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerChirps, handlerGetChirps, handlerGetChirpID, handlerDeleteChirpID } from "./api/chirps.js";
import { handlerUpdateUser, handlerUsers } from "./api/users.js";
import { handlerLogin } from "./api/login.js";
import { handlerRefresh } from "./api/refresh.js";
import { handlderRevoke } from "./api/revoke.js";

const app = express();
const PORT = 8080;


app.use(middlewareLogResponses)
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", (req, res, next) => {
    Promise.resolve(handlerReadiness(req, res)).catch(next)
});
app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handlerMetrics(req, res)).catch(next)
})
app.post("/admin/reset", (req, res, next) => {
    Promise.resolve(handlerReset(req, res)).catch(next)
});
app.post("/api/chirps", (req, res, next) => {
    Promise.resolve(handlerChirps(req, res)).catch(next)
});
app.get("/api/chirps", (req, res, next) => {
    Promise.resolve(handlerGetChirps(req, res)).catch(next)
});
app.get("/api/chirps/:chirpID", (req, res, next) => {
    Promise.resolve(handlerGetChirpID(req, res)).catch(next)
});
app.delete("/api/chirps/:chirpID", (req, res, next) => {
    Promise.resolve(handlerDeleteChirpID(req, res)).catch(next)
});
app.post("/api/users", (req, res, next) => {
    Promise.resolve(handlerUsers(req, res)).catch(next)
});
app.put("/api/users", (req, res, next) => {
    Promise.resolve(handlerUpdateUser(req, res)).catch(next)
});
app.post("/api/login", (req, res, next) => {
    Promise.resolve(handlerLogin(req, res)).catch(next)
});
app.post("/api/refresh", (req, res, next) => {
    Promise.resolve(handlerRefresh(req, res)).catch(next)
});
app.post("/api/revoke", (req, res, next) => {
    Promise.resolve(handlderRevoke(req, res)).catch(next)
});


app.use(middlewareErrorHandler)

app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`)
})