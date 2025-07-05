import { eq, and, isNull, gt } from "drizzle-orm";
import { db } from "../index.js"
import { NewUser, RefreshToken, refreshTokens, User, users } from "../schema.js"
import { InternalServerError, UnauthorizedError } from "../../api/errors.js";

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

export async function getUserByRefreshToken(refreshToken: string) {
    const [result] = await db.select({user: users})
    .from(users)
    .innerJoin(refreshTokens, eq(users.id, refreshTokens.userId))
    .where(
        and(
            eq(refreshTokens.token, refreshToken),
            isNull(refreshTokens.revokedAt),
            gt(refreshTokens.expiresAt, new Date())
        ),
    )
    .limit(1);
    return result
}

export async function updateUserPassword(email: string, newPasswordHash: string) :Promise<User> {
    const now =  new Date
    const [result] = await db.update(users)
    .set( {passwordHash: newPasswordHash, updatedAt: now})
    .where(eq(users.email, email))
    .returning();

    if (!result) {
        throw new InternalServerError("error updating user password")
    }

    return result
}