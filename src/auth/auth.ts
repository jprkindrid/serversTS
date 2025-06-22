import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}

export async function comparePasswordHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}
