import { Request, Response } from "express";
import { respondWithJSON } from "./json";

export async function handlerLogin(req: Request, res: Response) {

    

    respondWithJSON(res, 200, "wao very cool")
}