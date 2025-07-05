import { config } from "../../config.js";
import { db } from "../index.js";
import { NewRefreshToken, RefreshToken, refreshTokens, users } from "../schema.js";
import { eq, isNull, and, gt } from "drizzle-orm";

export async function saveRefreshToken(userID: string, token: string) {
  const rows = await db
    .insert(refreshTokens)
    .values({
      userId: userID,
      token: token,
      expiresAt: new Date(Date.now() + config.jwt.refreshDuration),
      revokedAt: null,
    })
    .returning();

  return rows.length > 0;
}

export async function revokeRefreshToken(token: string): Promise<RefreshToken> {
    const now = new Date
    const result = await db.update(refreshTokens)
    .set( {revokedAt: now, updatedAt: now})
    .where(eq(refreshTokens.token, token))
    .returning();

    if (result.length === 0){
        throw new Error("couldn't revoke token")
    }

    return result[0]
}