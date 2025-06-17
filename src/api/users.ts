import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "./errors.js";

export async function handlerUsers(req: Request, res: Response) {
    type jsonParams = {
        email: string;
    }
    const params: jsonParams = req.body;

    if (!params.email) {
        throw new BadRequestError("Bad Request")
    }

    // const user = await createUser({
    //     email: params.email
    // })

    respondWithJSON(res, 201, {
        // "id": user.id,
        // "createdAt": user.createdAt,
        // "updatedAt": user.updatedAt,
        "email": params.email
    })
}