// src/server.js
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDb.js';
import { globalMiddlewares, routes } from './config/appConfig.js';
import { fileURLToPath } from 'url';
import path from 'path';
import multer from 'multer';
import upload from './middlewares/upload.js';
// __dirname এর alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// created app 
const app = express();
dotenv.config();



// Apply all middlewares at once
app.use(...globalMiddlewares);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// destination




//  Loop through the array and apply routes
routes.forEach((route) => {
  app.use(route.path, route.router);
});

// connect to database
connectDB(app);

