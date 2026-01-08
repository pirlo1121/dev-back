import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
configDotenv();

const urlString = process.env.MONGO_URI;

export async function connectDb(): Promise<void> {
  if (!urlString) {
    console.error('MONGO_URI is not defined in environment variables');
    process.exit(1);
  }
  try {
    await mongoose.connect(urlString);

    console.log('Connect DB');

    // Events
    mongoose.connection.on('connected', () => {
      console.log(' Mongoose está conectado');
    });

    mongoose.connection.on('error', (err: any) => {
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

  } catch (error: any) {
    console.error(' No se pudo conectar a MongoDB:', error.message);
    process.exit(1); // KIll
  }
}
