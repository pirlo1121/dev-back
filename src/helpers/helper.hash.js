import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export const SALT_ROUNDS = 10;
import dotenv from 'dotenv';
dotenv.config();


export async function hashPass(plain) {
    if( typeof plain !== 'string' || plain.length === 0 ){
        throw new Error ('La contraseña no puede estar vacia');
    }
    // const salt = await bcrypt.genSalt(SALT_ROUNDS);
    // return bcrypt.hash(plain, salt);
    return await bcrypt.hash(plain, SALT_ROUNDS);

}

export function comparePass(plain, hashed){
    return bcrypt.compare(plain, hashed)
}

export function createToken(data){
    const secret  = process.env.SECRET_JWT
    try {
        const token = jwt.sign(data, secret, {expiresIn: "1h"});
        return token;
    } catch (error) {
        console.log(error)
    }
}

export function verifyToken(token){
    try {
        return jwt.verify(token, process.env.SECRET_JWT);
    } catch (error) {
        console.log(error);
        return null
    }
}