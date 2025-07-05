import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { getUserByEmail } from "../db/queries/users.js";
import { NewRefreshToken, refreshTokens, User, users } from "../db/schema.js";
import bcrypt from "bcrypt"
import { comparePasswordHash, makeAccessJWT, makeRefreshToken } from "../auth/auth.js";
import { config } from "../config.js";
import { insertRefreshToken } from "../db/queries/tokens.js";
import { UnauthorizedError } from "./errors.js";

type UserResponse = Omit<User, "passwordHash"> & {
    token: string
    refreshToken: string
};

export async function handlerLogin(req: Request, res: Response) {

    type jsonParams = {
        email: string;
        password: string;
    }

    const params: jsonParams = req.body;
    const user: User = await getUserByEmail(params.email)
    const match = await comparePasswordHash(params.password, user.passwordHash)
    if (!match) {
        throw new UnauthorizedError("incorrect username or password")
    }
    const accessTokenExpiration: number = 1000 * 60 * 60
    const refreshTokenExpiration: number = 1000 * 60 * 60 * 24 * 60 

    const JWT = makeAccessJWT(user.id, accessTokenExpiration, config.api.JWTSecret)
    const refreshToken = makeRefreshToken();
    const now: number = Date.now()

    const rToken : NewRefreshToken = {
        userId: user.id,
        expiresAt: new Date(Date.now() + refreshTokenExpiration),
        revokedAt: null,
        token: refreshToken,
    }
    const refreshTokenDB = await insertRefreshToken(rToken)

    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: JWT,
        refreshToken: refreshTokenDB.token,
    } satisfies UserResponse)
}
