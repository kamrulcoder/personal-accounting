// src/server.js
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDb.js';
import { globalMiddlewares, routes } from './config/appConfig.js';
// created app 
const app = express();
dotenv.config();



// Apply all middlewares at once
app.use(...globalMiddlewares);

//  Loop through the array and apply routes
routes.forEach((route) => {
  app.use(route.path, route.router);
});

// connect to database
connectDB(app);

