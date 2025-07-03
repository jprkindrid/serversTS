import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../api/errors.js"
import { Request } from "express";

const TOKEN_ISSUER = "chirpy"


export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}

export async function comparePasswordHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

    type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string) {

    const iat = Math.floor(Date.now() / 1000);
    const tokenPayload: payload = {
        iss: TOKEN_ISSUER,
        sub: userID,
        iat: iat,
        exp: iat + expiresIn,
    } satisfies payload
    const token = jwt.sign(tokenPayload, secret, {algorithm: "HS256"})
    return token
}

export function validateJWT(tokenString: string, secret: string): string {
    let validatedToken: payload;
    try {
        validatedToken = jwt.verify(tokenString, secret) as payload
    } catch (err) {
        throw new UnauthorizedError("invalid token")
    }

    if (validatedToken.iss !== TOKEN_ISSUER) {
        throw new UnauthorizedError("invalid issuer")
    }

    if (!validatedToken.sub) {
        throw new UnauthorizedError("No user ID in token")
    }

    return validatedToken.sub
}

export function getBearerToken(req: Request): string {
    const authHeader = req.get("Authorization")
    if (!authHeader) {
        throw new UnauthorizedError("missing authorization header")
    }

    const authSplit: string[] = authHeader.split(" ")

    if (authSplit.length !== 2){
        throw new UnauthorizedError("invalid authorization header")
    }

    if (authSplit[0].toLowerCase() !== "bearer") {
        throw new UnauthorizedError("invalid authorization header, missing 'Bearer'")
    }

    const token = authSplit[1]

    return token
}