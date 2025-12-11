import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDb } from './src/config/configDb.js';
import dotenv from 'dotenv';
import routerAuth from './src/routes/auth.routes.js';
import routerProjects from './src/routes/projects.routes.js';
import routerContact from './src/routes/contatc.routes.js';
import { errorHandler, notFoundHandler } from './src/middlewares/errorHandler.js';
import { cleanAll } from './src/middlewares/cleanAll.js';
const app = express();

dotenv.config({ quiet: true });
connectDb();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:4200',  // IP angular
    credentials: true
}));

// clena routes
app.use(cleanAll)

// ROUTES
app.use('/api', routerAuth)
app.use('/api', routerProjects)
app.use('/api', routerContact)

// Error Handlers

app.use(notFoundHandler);
app.use(errorHandler)




app.listen(3000, () => {
    console.log(`Server running in port `, 3000)
})

