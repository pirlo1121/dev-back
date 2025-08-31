import bcrypt from 'bcrypt';

export const SALT_ROUNDS = 10;

export async function hashPass(plain) {
    if( typeof plain !== 'string' || plain.length === 0 ){
        throw new Error ('La contraseña no puede estar vacia');
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(plain, salt);
    
}

export function comparePass(plain, hashed){
    return bcrypt.compare(plain, hashed)
}