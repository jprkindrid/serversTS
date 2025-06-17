process.loadEnvFile()

type APIConfig = {
    fileserverHits: number;
    dbURL: string;
}

const dbURL = process.env.DB_URL ?? "";

export const APIConfig: APIConfig = {
    fileserverHits: 0,
    dbURL: envOrThrow(dbURL)
}

function envOrThrow(key: string) {
    if (key === "") {
        throw new Error("required paramater missing from env file")
    }
    return key
}