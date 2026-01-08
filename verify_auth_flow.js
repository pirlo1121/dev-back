import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { connectDb } from './src/config/configDb.js';
import { User } from './src/models/users.models.js';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import routerAuth from './src/routes/auth.routes.js';
import { cleanAll } from './src/middlewares/cleanAll.js';
import { errorHandler, notFoundHandler } from './src/middlewares/errorHandler.js';

dotenv.config({ quiet: true });

const PORT = 3001; // Use a different port for testing
const BASE_URL = `http://localhost:${PORT}/api`;

const jar = new CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true }));

async function startServer() {
    const app = express();
    await connectDb();
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({
        origin: 'http://localhost:4200',
        credentials: true
    }));
    app.use(cleanAll);
    app.use('/api', routerAuth);
    app.use(notFoundHandler);
    app.use(errorHandler);

    return new Promise((resolve) => {
        const server = app.listen(PORT, () => {
            console.log(`Test server running on port ${PORT}`);
            resolve(server);
        });
    });
}

async function verify() {
    let server;
    let testUser;

    try {
        server = await startServer();

        // Create Test User
        const email = `test_${Date.now()}@example.com`;
        const password = 'password123';

        // Manually create user (hashing is handled in pre-save hook usually, checking model...)
        // If hash is in helper, I might need to hash it. 
        // Let's check user model or just try creating it.
        // Usually models have pre-save hooks. If not, I'll need to import hash helper.
        // Checking auth controller, it uses comparePass from helper.hash.js.
        // So I probably need to hash it if I create directly.

        // Let's import hash helper
        const { hashPass } = await import('./src/helpers/helper.hash.js');
        const hashedPassword = await hashPass(password);

        testUser = await User.create({
            email,
            password: password, // Pre-save hook will hash it
            name: 'Test User',
            age: 25,
            role: 'user'
        });

        console.log('Test user created:', email);

        // 1. Login
        console.log('1. Testing Login...');
        const loginRes = await client.post(`${BASE_URL}/auth/login`, {
            email,
            password
        });

        if (loginRes.status === 200 && loginRes.headers['set-cookie']) {
            console.log('✅ Login successful, cookie set.');
        } else {
            throw new Error('Login failed or no cookie set');
        }

        // 2. Access Protected Route
        console.log('2. Testing Protected Route...');
        const protectedRes = await client.get(`${BASE_URL}/get/${testUser._id}`);
        if (protectedRes.status === 200 && protectedRes.data.ok) {
            console.log('✅ Protected route access successful.');
        } else {
            throw new Error('Protected route access failed');
        }

        // 3. Logout
        console.log('3. Testing Logout...');
        const logoutRes = await client.post(`${BASE_URL}/auth/logout`);
        if (logoutRes.status === 200) {
            console.log('✅ Logout successful.');
        } else {
            throw new Error('Logout failed');
        }

        // 4. Access Protected Route (After Logout)
        console.log('4. Testing Protected Route after Logout...');
        try {
            await client.get(`${BASE_URL}/get/${testUser._id}`);
            console.error('❌ Protected route access SHOULD have failed but succeeded.');
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                console.log('✅ Protected route access failed as expected (401/403).');
            } else {
                throw error; // Re-throw if it's not the expected error
            }
        }

    } catch (error) {
        console.error('❌ Verification Failed:', error.message);
        if (error.response) console.error('Response:', error.response.data);
    } finally {
        if (testUser) {
            await User.findByIdAndDelete(testUser._id);
            console.log('Test user deleted.');
        }
        if (server) {
            server.close();
        }
        // Close DB connection if needed, but mongoose usually handles it.
        process.exit(0);
    }
}

verify();
