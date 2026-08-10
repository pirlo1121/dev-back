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
dotenv.config();
const app = express();

dotenv.config({ quiet: true });
connectDb();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [process.env.CLIENT1 ?? '' , process.env.CLIENT2 ?? ''],
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




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running in port `, PORT)
})

