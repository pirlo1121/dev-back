import mongoose, { Document, CallbackError  } from 'mongoose';

import bcrypt from 'bcrypt';
import { hashPass } from '../helpers/helper.hash';

export interface IUser extends Document {
  name: string;
  age: number;
  profession: string;
  email: string;
  password?: string;
  role: string;
  languages: string[];
  skills: string[];
  bio?: string;
  avatar?: string;
  image: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
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
  if (!this.isModified('password')) return;

  if (this.password) {
    this.password = await hashPass(this.password);
  }
});


// compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password as string);
};

export const User = mongoose.model<IUser>('User', userSchema);
