"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedUser = seedUser;
// seedUser.js
const users_models_1 = require("../models/users.models");
const configDb_1 = require("./configDb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ quiet: true });
const data = {
    name: process.env.NAME,
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    role: process.env.ROLE,
    age: process.env.AGE ? parseInt(process.env.AGE) : undefined,
    profession: process.env.PROFESSION,
    languages: process.env.LANGUAGES ? process.env.LANGUAGES.split(",") : [],
    skills: process.env.SKILLS ? process.env.SKILLS.split(",") : [],
    bio: process.env.BIO,
    avatar: process.env.AVATAR,
    socialLinks: {
        github: process.env.GITHUB,
        linkedin: process.env.LINKEDIN
    }
};
console.log('dataaa: ', data);
async function seedUser() {
    try {
        await (0, configDb_1.connectDb)();
        const count = await users_models_1.User.countDocuments();
        if (count === 0) {
            if (!data.name || !data.email || !data.password || !data.age) {
                console.error("Missing required environment variables for seeding user");
                process.exit(1);
            }
            const newUser = new users_models_1.User(data);
            await newUser.save();
            console.log(" Usuario admin creado");
        }
        else {
            console.log(" Ya existe al menos un usuario, no se creó ninguno");
        }
        process.exit();
    }
    catch (err) {
        console.error(" Error al crear usuario:", err);
        process.exit(1);
    }
}
(async () => {
    await seedUser();
})();
