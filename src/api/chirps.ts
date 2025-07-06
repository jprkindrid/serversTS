import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "./errors.js";
import { createChirp, getAllChirps, getChirpyById, deleteChirpByID } from "../db/queries/chirps.js";
import { Chirp } from "../db/schema.js";
import { getBearerToken, validateJWT } from "../auth/auth.js";
import { config } from "../config.js";

export async function handlerChirps(req: Request, res: Response) {
    type jsonParams = {
        body: string;
    }

    const params: jsonParams = req.body;
    const cleanedBody = validateBody(params.body)
    const JWTToken = getBearerToken(req)
    const userID = validateJWT(JWTToken, config.jwt.secret)
    const chirp = await createChirp({
        body: cleanedBody,
        userId: userID,
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

    if (!chirp) {
        throw new NotFoundError("chirp not found")
    }
    
    respondWithJSON(res, 200, chirp)
}

export async function handlerDeleteChirpID(req: Request, res: Response) {
    const chirpID = req.params.chirpID;
    const chirp = await getChirpyById(chirpID);

    if (!chirp) {
        throw new NotFoundError("chirp not found")
    }

    const accessToken = getBearerToken(req);
    const userID = validateJWT(accessToken, config.jwt.secret)

    if (userID !== chirp.userId) {
        throw new ForbiddenError("user is not author of chirp")
    }
    
    const deleted = await deleteChirpByID(chirpID)

    if (!deleted) {
        throw new Error("could not delete chirp")
    }

    res.status(204).end();
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