import { Request, RequestHandler, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { createUser, getUserByEmail, getUserByRefreshToken, updateUserPassword } from "../db/queries/users.js";
import { BadRequestError, UnauthorizedError } from "./errors.js";
import { getBearerToken, hashPassword } from "../auth/auth.js";
import { NewUser } from "../db/schema.js";

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

    const refreshToken = getBearerToken(req);

    if (!refreshToken) {
        throw new UnauthorizedError("invalid access token")
    }
    
    const params: jsonParams = req.body;
    

    const eUser = await getUserByEmail(params.email)
    const rUser = await getUserByRefreshToken(refreshToken)

    if (eUser.id !== rUser.user.id) {
        throw new UnauthorizedError("refresh token does not match requested user")
    }

    const passwordHash =  await hashPassword(params.password)

    const updatedUser = await updateUserPassword(params.email, passwordHash)

    respondWithJSON(res, 200, {
        id: updatedUser.id,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        email: updatedUser.email
    } satisfies UserResponse)
}