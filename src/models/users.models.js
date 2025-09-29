import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { hashPass } from '../helpers/helper.hash.js';

const userSchema = new mongoose.Schema({
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
  socialLinks: {
    github: { type: String, trim: true },
    linkedin: { type: String, trim: true }
},
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if( !this.isModified('password')) return next();

    try {
        this.password = await hashPass(this.password);
        next()
    } catch (error) {
        next(err)
    }
    
});

// compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
