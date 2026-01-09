"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const helper_hash_1 = require("../helpers/helper.hash");
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    profession: {
        type: String,
        default: "Software Developer"
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email inválido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [6, 'la contraseña debe tener mínimo 6 caracteres']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    languages: {
        type: [String], // array de strings
        default: []
    },
    skills: {
        type: [String], // array de strings
        default: []
    },
    bio: { type: String, trim: true },
    avatar: { type: String, default: "" },
    image: String, // S3
    socialLinks: {
        github: { type: String, trim: true },
        linkedin: { type: String, trim: true }
    },
}, { timestamps: true });
userSchema.pre('save', async function () {
    if (!this.isModified('password'))
        return;
    if (this.password) {
        this.password = await (0, helper_hash_1.hashPass)(this.password);
    }
});
// compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt_1.default.compare(candidatePassword, this.password);
};
exports.User = mongoose_1.default.model('User', userSchema);
