"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SALT_ROUNDS = void 0;
exports.hashPass = hashPass;
exports.comparePass = comparePass;
exports.createToken = createToken;
exports.verifyToken = verifyToken;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.SALT_ROUNDS = 10;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function hashPass(plain) {
    if (typeof plain !== 'string' || plain.length === 0) {
        throw new Error('La contraseña no puede estar vacia');
    }
    // const salt = await bcrypt.genSalt(SALT_ROUNDS);
    // return bcrypt.hash(plain, salt);
    return await bcrypt_1.default.hash(plain, exports.SALT_ROUNDS);
}
function comparePass(plain, hashed) {
    return bcrypt_1.default.compare(plain, hashed);
}
function createToken(data) {
    const secret = process.env.SECRET_JWT;
    if (!secret) {
        throw new Error("SECRET_JWT must be defined in the .env file");
    }
    try {
        const token = jsonwebtoken_1.default.sign(data, secret, { expiresIn: "1h" });
        return token;
    }
    catch (error) {
        console.log(error);
    }
}
function verifyToken(token) {
    const secret = process.env.SECRET_JWT;
    if (!secret) {
        throw new Error("SECRET_JWT must be defined in the .env file");
    }
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        console.log(error);
        return null;
    }
}
