import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDb } from './src/config/configDb';
import dotenv from 'dotenv';
import routerAuth from './src/routes/auth.routes';
import routerProjects from './src/routes/projects.routes';
import routerContact from './src/routes/contact.routes';
import { errorHandler, notFoundHandler } from './src/middlewares/errorHandler';
import { cleanAll } from './src/middlewares/cleanAll';
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

