import { Request, Response } from "express";
import { getBearerToken, makeAccessJWT } from "../auth/auth.js";
import { getRefreshToken } from "../db/queries/tokens.js";
import { InternalServerError, UnauthorizedError } from "./errors.js";
import { respondWithError, respondWithJSON } from "./json.js";
import { getUserByRefreshToken } from "../db/queries/users.js";
import { User } from "../db/schema.js";
import { config } from "../config.js";

export async function handlerRefresh(req: Request, res: Response) {
    const bearerToken = getBearerToken(req)
    const refreshToken = await getRefreshToken(bearerToken)
    if (!refreshToken) {
        throw new UnauthorizedError("missing refresh token")
    }

    if (refreshToken.revokedAt !== null) {
        throw new UnauthorizedError("refresh token expired")
    }
    
    const expiresAt = new Date(refreshToken.expiresAt).getTime();
    if (expiresAt < Date.now()) {
        throw new UnauthorizedError("refresh token expired")
    }
    const rToken = refreshToken.token;
    const user = await getUserByRefreshToken(rToken)

    if (!user) {
        throw new InternalServerError("couldnt get user from refresh token in database")
    }
    const accessTokenExpiration = 1000 * 60 * 60
    const accessToken = makeAccessJWT(user.id, accessTokenExpiration, config.api.JWTSecret)

    respondWithJSON(res, 200, {
        token: accessToken
    })
    
}