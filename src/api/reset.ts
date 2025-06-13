import type { Request, Response } from "express"
import { APIConfig } from "../config.js"

export async function handlerReset(_: Request, res: Response) {
  APIConfig.fileserverHits = 0
  res.write("Fileserver hits reset to 0");
  res.end();
}