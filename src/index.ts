import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses } from "./api/middleware.js";

const app = express();
const PORT = 8080;

app.use("/app", express.static("./src/app"));
app.use(middlewareLogResponses)

app.get("/healthz", middlewareLogResponses, handlerReadiness);


app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`)
})