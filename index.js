import express from 'express';
import cors from 'cors';
import { connectDb } from './src/config/configDb.js';
import  dotenv  from 'dotenv';
const app = express();

dotenv.config();
connectDb();
app.use( express.json() );
app.use( cors() );


// ROUTES


app.listen(3000, ()=>{
    console.log(`Server running in port `, 3000)
})

