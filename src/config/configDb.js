import mongoose from 'mongoose';

const url = 'mongodb://localhost:27017'

export async function connectDb() {
    try {
        await mongoose.connect(url)
        console.log('Connect mongoose');
    } catch (error) {
        console.log(error)
        console.log('No se pudo conectar a la base de datos')
    }
    
}