import express from 'express';
import cors from 'cors';
import { connectDb } from './src/config/configDb.js';
import  dotenv  from 'dotenv';
import routerAuth from './src/routes/auth.routes.js';

const app = express();

dotenv.config({quiet: true});
connectDb();
// await seedUser();
app.use( express.json() );
app.use( cors() );


// ROUTES
app.use('/api/auth', routerAuth)


app.listen(3000, ()=>{
    console.log(`Server running in port `, 3000)
})

