import { db } from "../index.js";
import { NewRefreshToken, RefreshToken, refreshTokens } from "../schema.js";
import { eq } from "drizzle-orm";

export async function insertRefreshToken(token: NewRefreshToken): Promise<NewRefreshToken> {
    const [result] = await db.insert(refreshTokens).values(token).returning();
    return result as NewRefreshToken
}

export async function selectRefreshToken(token: string): Promise<RefreshToken> {
    const [result] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token))
    return result as RefreshToken
}

export async function revokeRefreshToken(token: string): Promise<RefreshToken> {
    const now = new Date
    const [result] = await db.update(refreshTokens)
    .set( {revokedAt: now})
    .where(eq(refreshTokens.token, token))
    .returning();

    return result
}