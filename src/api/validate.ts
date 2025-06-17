import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";

export async function handlerValidate(req: Request, res: Response) {
    type jsonParams = {
        body: string;
    }

    const params: jsonParams = req.body;
    const maxLength = 140;
    if (params.body.length > maxLength) {
        respondWithError(res, 400, "Chirp is too long");
        return;
    }

    const cleanedBody = cleanBody(params.body)

    respondWithJSON(res, 200, {
        cleanedBody: cleanedBody,
    })
}

function cleanBody(body: string) {
    const badWords = ["kerfuffle" , "sharbert" , "fornax"]
    const bodyArray = body.split(" ")
    const cleanedArray = bodyArray.map((word) =>
        badWords.includes(word.toLowerCase()) ? "****" : word    
    );
    return cleanedArray.join(" ")
}