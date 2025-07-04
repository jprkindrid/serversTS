import { Request, Response } from "express";
import { getBearerToken } from "../auth/auth";
import { revokeRefreshToken } from "../db/queries/tokens";
import { respondWithError, respondWithJSON } from "./json";

export async function revokeHandler(req: Request, res: Response) {
    const bearerToken = getBearerToken(req)
    const revokedToken = await revokeRefreshToken(bearerToken)
    if (revokedToken.revokedAt === null) {
        respondWithError(res, 500, "error revoking refresh token")
    }

    respondWithJSON(res, 204, "")
    
}