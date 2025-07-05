import { eq, and, isNull, gt } from "drizzle-orm";
import { db } from "../index.js"
import { NewUser, RefreshToken, refreshTokens, User, users } from "../schema.js"
import { InternalServerError, UnauthorizedError } from "../../api/errors.js";

export async function createUser(user: NewUser) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result
}

export async function deleteUsers() {
    await db.delete(users)
}

export async function getUserByEmail(email: string) {
    const [result] = await db.select().from(users).where(eq(users.email, email));
    if (!result) {
        throw new Error("error getting user by email")
    }
    return result
}

export async function getUserByRefreshToken(token: string) {
  const [result] = await db
    .select({ user: users })
    .from(users)
    .innerJoin(refreshTokens, eq(users.id, refreshTokens.userId))
    .where(
      and(
        eq(refreshTokens.token, token),
        isNull(refreshTokens.revokedAt),
        gt(refreshTokens.expiresAt, new Date()),
      ),
    )
    .limit(1);

  return result;
}


export async function updateUserParams(userID: string, newEmail: string, newPasswordHash: string) {
    const [result] = await db
        .update(users)
        .set( {
            email: newEmail,
            passwordHash: newPasswordHash,
        })
        .where(eq(users.id, userID))
        .returning();

    return result

}
