import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
configDotenv();

const url = process.env.MONGO_URI;

export async function connectDb() {
  try {
    await mongoose.connect(url);

    console.log('Connect DB');

    // Events
    mongoose.connection.on('connected', () => {
      console.log(' Mongoose está conectado');
    });

    mongoose.connection.on('error', (err) => {
      console.error(' Error en la conexión a MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log(' Mongoose se ha desconectado');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log(' Conexión de MongoDB cerrada por SIGINT');
      process.exit(0);
    });

  } catch (error) {
    console.error(' No se pudo conectar a MongoDB:', error.message);
    process.exit(1); // KIll
  }
}
