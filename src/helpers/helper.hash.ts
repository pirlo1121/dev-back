import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
export const SALT_ROUNDS = 10;
import dotenv from 'dotenv';
dotenv.config();


export async function hashPass(plain: string): Promise<string> {
    if (typeof plain !== 'string' || plain.length === 0) {
        throw new Error('La contraseña no puede estar vacia');
    }
    // const salt = await bcrypt.genSalt(SALT_ROUNDS);
    // return bcrypt.hash(plain, salt);
    return await bcrypt.hash(plain, SALT_ROUNDS);

}

export function comparePass(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed)
}

export function createToken(data: any): string | undefined {
    const secret = process.env.SECRET_JWT;
    if (!secret) {
        throw new Error("SECRET_JWT must be defined in the .env file");
    }
    try {
        const token = jwt.sign(data, secret, { expiresIn: "1h" });
        return token;
    } catch (error) {
        console.log(error)
    }
}

export function verifyToken(token: string): string | JwtPayload | null {
    const secret = process.env.SECRET_JWT;
    if (!secret) {
        throw new Error("SECRET_JWT must be defined in the .env file");
    }
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        console.log(error);
        return null
    }
}