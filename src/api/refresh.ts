import { Request, Response } from "express";
import { getBearerToken, makeAccessJWT } from "../auth/auth.js";
import { InternalServerError, UnauthorizedError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { getUserByRefreshToken } from "../db/queries/users.js";
import { config } from "../config.js";

export async function handlerRefresh(req: Request, res: Response) {
    const refreshToken = getBearerToken(req)
    const refreshUser = await getUserByRefreshToken(refreshToken)
    if (!refreshUser) {
        throw new UnauthorizedError("invalid refresh token")
    }

    const user = refreshUser.user

    const accessToken = makeAccessJWT(
        user.id,
        config.jwt.defaultDuration,
        config.jwt.secret
    );

    respondWithJSON(res, 200, {
        token: accessToken
    })
    
}