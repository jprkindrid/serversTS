import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { getUserByEmail } from "../db/queries/users.js";
import { NewRefreshToken, refreshTokens, User, users } from "../db/schema.js";
import { comparePasswordHash, makeAccessJWT, makeRefreshToken } from "../auth/auth.js";
import { config } from "../config.js";
import { UnauthorizedError } from "./errors.js";
import { saveRefreshToken } from "../db/queries/tokens.js";

type LoginResponse = Omit<User, "passwordHash"> & {
    token: string
    refreshToken: string
};

export async function handlerLogin(req: Request, res: Response) {

    type jsonParams = {
        email: string;
        password: string;
    }

    const params: jsonParams = req.body;
    const user = await getUserByEmail(params.email)
    const match = await comparePasswordHash(params.password, user.passwordHash)
    if (!match) {
        throw new UnauthorizedError("incorrect username or password")
    }

    const accessToken = makeAccessJWT(user.id, config.jwt.defaultDuration, config.jwt.secret )
    const refreshToken = makeRefreshToken();
    const saved = await saveRefreshToken(user.id, refreshToken)
    
    if (!saved) {
        throw new UnauthorizedError("could not save refresh token")
    }

    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: accessToken,
        refreshToken: refreshToken,
    } satisfies LoginResponse)
}
