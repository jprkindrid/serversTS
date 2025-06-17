import type { Request, Response } from "express"
import { config } from "../config.js"

export async function handlerReset(_: Request, res: Response) {
  config.api.fileServerHits = 0
  res.write("Fileserver hits reset to 0, all users deleted");
  res.end();
}