import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";
import { createChirp, getAllChirps, getChirpyById } from "../db/queries/chirps.js";
import { Chirp } from "src/db/schema.js";

export async function handlerChirps(req: Request, res: Response) {
    type jsonParams = {
        body: string;
        userId: string;
    }

    const params: jsonParams = req.body;
    const cleanedBody = validateBody(params.body)
    const chirp = await createChirp({
        body: cleanedBody,
        userId: params.userId,
    })

    respondWithJSON(res, 201, chirp)
}

export async function handlerGetChirps(_: Request, res: Response) {
    const chirps: Chirp[] = await getAllChirps()
    respondWithJSON(res, 200, chirps)
}

export async function handlerGetChirpID(req: Request, res: Response) {
    const chirpID = req.params.chirpID
    const chirp = await getChirpyById(chirpID)
    respondWithJSON(res, 200, chirp)
}

function validateBody(body: string) {
    
    const maxLength = 140;
    if (body.length > maxLength) {
        throw new BadRequestError("Chirp is too long. Max length is 140")
    }

    const badWords = ["kerfuffle" , "sharbert" , "fornax"]

    return cleanBody(body, badWords)
}

function cleanBody(body: string, badWords: string[]) {
    
    const bodyArray = body.split(" ")
    const cleanedArray = bodyArray.map((word) =>
        badWords.includes(word.toLowerCase()) ? "****" : word    
    );
    return cleanedArray.join(" ")
}