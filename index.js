import express from 'express'
import cors from 'cors'
import { connectDb } from './src/config/configDb.js';
const app = express();

connectDb();
app.use( express.json() );
app.use( cors() );


// ROUTES


app.listen(3000, ()=>{
    console.log(`Server running in port `, 3000)
})

