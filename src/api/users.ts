import { Request, RequestHandler, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { createUser, getUserByRefreshToken, updateUserParams } from "../db/queries/users.js";
import { BadRequestError, UnauthorizedError } from "./errors.js";
import { getBearerToken, hashPassword, validateJWT } from "../auth/auth.js";
import { NewUser } from "../db/schema.js";
import { config } from "../config.js";

type UserResponse = Omit<NewUser, "passwordHash">;

export async function handlerUsers(req: Request, res: Response) {
    type jsonParams = {
        email: string;
        password: string;
    }

    const params: jsonParams = req.body;

    if (!params.email || !params.password) {
        throw new BadRequestError("Bad Request")
    }

    const hashedPassword = await hashPassword(params.password)

    const user = await createUser({
        email: params.email,
        passwordHash: hashedPassword,
    })

    if (!user) {
        throw new Error("Could not create user");
    }

    respondWithJSON(res, 201, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: params.email
    } satisfies UserResponse)
}

export async function handlerUpdateUser(req: Request, res: Response) {
    type jsonParams = {
        email: string;
        password: string;
    };

    const params: jsonParams = req.body;

    const accessToken = getBearerToken(req);

    if (!accessToken) {
        throw new UnauthorizedError("invalid access token")
    }

    const userID = validateJWT(accessToken, config.jwt.secret)

    const hashedPassword = await hashPassword(params.password)

    const updatedUser = await updateUserParams(userID, params.email, hashedPassword )

    respondWithJSON(res, 200, {
        id: updatedUser.id,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        email: updatedUser.email
    } satisfies UserResponse)
}