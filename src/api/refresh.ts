import { Request, Response } from "express";
import { getBearerToken, makeAccessJWT } from "../auth/auth";
import { selectRefreshToken } from "../db/queries/tokens";
import { UnauthorizedError } from "./errors";
import { respondWithJSON } from "./json";
import { getUserByRefreshToken } from "../db/queries/users";
import { User } from "../db/schema";
import { config } from "../config";

export async function handlerRefresh(req: Request, res: Response) {
    const bearerToken = getBearerToken(req)
    const refreshToken = await selectRefreshToken(bearerToken)
    if (!refreshToken) {
        throw new UnauthorizedError("missing refresh token")
    }

    if (refreshToken.revokedAt !== null) {
        throw new UnauthorizedError("refresh token expired")
    }
        
    if (refreshToken.expiresAt.getTime() < Date.now()) {
        throw new UnauthorizedError("refresh token expired")
    }

    const user: User = await getUserByRefreshToken(refreshToken.token)
    const accessTokenExpiration: number = 1000 * 60 * 60
    const accessToken = makeAccessJWT(user.id, accessTokenExpiration, config.api.JWTSecret)

    respondWithJSON(res, 200, {
        token: accessToken
    })
    
}