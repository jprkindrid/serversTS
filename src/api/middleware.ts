import {Request, Response, NextFunction } from "express";
import { APIConfig } from "../config.js"
import { respondWithError } from "./json.js";

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
  res.on("finish", () => {
    const statusCode = res.statusCode;

    if (statusCode >= 300) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
    }
  });

  next();
}

export function middlewareMetricsInc(_: Request, __: Response, next: NextFunction) {
  APIConfig.fileserverHits++
  next();
}

export function middlewareErrorHandler(
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction,
) {
  console.log(err.message);
  let statusCode = 500;
  let message = "Something went wrong on our end"
  respondWithError(res, statusCode, message)
}