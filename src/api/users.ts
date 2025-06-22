import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "./errors.js";
import { hashPassword } from "../auth/auth.js";
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