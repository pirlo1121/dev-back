"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = connectDb;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
const urlString = process.env.MONGO_URI;
async function connectDb() {
    if (!urlString) {
        console.error('MONGO_URI is not defined in environment variables');
        process.exit(1);
    }
    try {
        await mongoose_1.default.connect(urlString);
        console.log('Connect DB');
        // Events
        mongoose_1.default.connection.on('connected', () => {
            console.log(' Mongoose está conectado');
        });
        mongoose_1.default.connection.on('error', (err) => {
            console.error(' Error en la conexión a MongoDB:', err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.log(' Mongoose se ha desconectado');
        });
        process.on('SIGINT', async () => {
            await mongoose_1.default.connection.close();
            console.log(' Conexión de MongoDB cerrada por SIGINT');
            process.exit(0);
        });
    }
    catch (error) {
        console.error(' No se pudo conectar a MongoDB:', error.message);
        process.exit(1); // KIll
    }
}
