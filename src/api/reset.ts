import type { Request, Response } from "express"
import { config } from "../config.js"
import { deleteUsers } from "../db/queries/users.js";

export async function handlerReset(_: Request, res: Response) {
  config.api.fileServerHits = 0
  deleteUsers()
  res.write("Fileserver hits reset to 0, all users deleted");
  res.end();
}