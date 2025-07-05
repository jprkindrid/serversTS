import { Request, Response } from "express";
import { getBearerToken } from "../auth/auth.js";
import { revokeRefreshToken } from "../db/queries/tokens.js";
import { respondWithError, respondWithJSON } from "./json.js";

export async function handlderRevoke(req: Request, res: Response) {
    const bearerToken = getBearerToken(req)
    const revokedToken = await revokeRefreshToken(bearerToken)
    if (!revokedToken) {
        respondWithError(res, 401, "invalid refresh token")
        return
    }

    respondWithJSON(res, 204, "")
    
}