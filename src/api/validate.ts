import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";

export async function handlerValidate(req: Request, res: Response) {
    type jsonParams = {
        body: string;
    }

    let body = ""
    req.on("data", (chunk) => {
    body += chunk;
    });

    let params: jsonParams
    req.on("end", () => {
        try {
            params = JSON.parse(body);
        } catch (err) {
            respondWithError(res, 400, "Invalid JSON");
            return;
        }

        const maxLengh = 140;
        if (params.body.length > maxLengh) {
            respondWithError(res, 400, "Chirp is too long")
            return; 
        }

        respondWithJSON(res, 200, {
            valid: true,
        })
    })
}