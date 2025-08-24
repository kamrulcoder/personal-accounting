// src/config/appConfig.js
import authRoutes from '../routes/auth.routes.js';
import userRoutes from '../routes/user.routes.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

export const globalMiddlewares = [
    express.json(), // Parse JSON bodies
    express.urlencoded({
        extended: true
    }),
    cors({
        origin: 'http://localhost:5173',
        credentials: true
    }), // Enable CORS

    cookieParser(),

    // Add more middleware functions as needed
];


// all routes here 
export const routes = [
    { path: '/api/auth', router: authRoutes },
    { path: '/api/user', router: userRoutes },

    // Add more routes here...
];

