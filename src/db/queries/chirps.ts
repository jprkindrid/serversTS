import { db } from "../index.js";
import { chirps, NewChirp, Chirp } from "../schema.js";
import { sql, eq } from 'drizzle-orm'

export async function createChirp(chirp: NewChirp) {
  const [result] = await db.insert(chirps).values(chirp).returning();
  return result;
}

export async function getAllChirps(): Promise<Chirp[]> {
    const result: Chirp[] = await db.select().from(chirps).orderBy(sql `${chirps.createdAt} asc nulls first`)
    return result;
}

export async function getChirpyById(chirpID: string) {
    const [result] = await db.select().from(chirps).where(eq(chirps.id, chirpID))
    return result
}