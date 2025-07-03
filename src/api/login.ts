import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { getUserByEmail } from "../db/queries/users.js";
import { User } from "../db/schema.js";
import bcrypt from "bcrypt"
import { comparePasswordHash, makeJWT } from "../auth/auth.js";
import { config } from "../config.js";

type UserResponse = Omit<User, "passwordHash"> & {
    token: string
};

export async function handlerLogin(req: Request, res: Response) {

    type jsonParams = {
        email: string;
        password: string;
        expiresInSeconds?: number;
    }

    const params: jsonParams = req.body;
    const user: User = await getUserByEmail(params.email)
    const match = await comparePasswordHash(params.password, user.passwordHash)
    if (!match) {
        respondWithError(res, 401, "Incorrect username or password")
    }
    const expiresInSeconds: number = params.expiresInSeconds ?? 1000 * 60 * 60

    const JWT = makeJWT(user.id, expiresInSeconds, config.api.JWTSecret)

    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: JWT,
    } satisfies UserResponse)
}
