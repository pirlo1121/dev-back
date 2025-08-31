// seedUser.js
import { User } from "../models/users.models.js";
import { connectDb } from "./configDb.js";
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

    const data = {
        name: process.env.NAME,
        email: process.env.EMAIL,
        password: process.env.PASSWORD,
        role: process.env.ROLE
    }
    console.log('dataaa: ', data)

export async function seedUser() {

  try {
    await connectDb();

    const count = await User.countDocuments();
    if (count === 0) {
      const newUser = new User(data);
      await newUser.save();
      console.log(" Usuario admin creado");
    } else {
      console.log(" Ya existe al menos un usuario, no se creó ninguno");
    }

    process.exit(); 
  } catch (err) {
    console.error(" Error al crear usuario:", err);
    process.exit(1);
  }
}
await seedUser()