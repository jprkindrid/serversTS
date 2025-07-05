import { eq } from "drizzle-orm";
import { db } from "../index.js"
import { NewUser, RefreshToken, refreshTokens, User, users } from "../schema.js"
import { UnauthorizedError } from "../../api/errors.js";

export async function createUser(user: NewUser) {
    const [result] = await db.insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning() as NewUser[];
    return result
}

export async function deleteUsers() {
    await db.delete(users)
}

export async function getUserByEmail(email: string){
    const [result] = await db.select().from(users).where(eq(users.email, email)) as User[];
    return result
}

export async function getUserByRefreshToken(refreshToken: string): Promise<User> {
    const [rToken] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, refreshToken));
    if (!rToken) {
        throw new UnauthorizedError("invalid refresh token")
    }
    const [result] = await db.select().from(users).where(eq(users.id, rToken.userId));
    return result
}