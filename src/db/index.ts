import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "./schema.js"
import { APIConfig } from "../config.js"

const conn = postgres(APIConfig.dbURL)
export const db = drizzle(conn, { schema })