// src/routes/auth.routes.js

import express from 'express';
import {  forgotPasswordController, loginController, logoutController, registerController, resetPasswordController,  } from '../controllers/auth.controllers.js';
const router = express.Router();

// ========== Auth Routes ============= //
// User Registration, Login, Logout
router.post('/register', registerController); 
router.post('/login', loginController);
router.post('/logout', logoutController);

// ========= forgot, reset password ========== //
// Password reset
router.post("/forgot-password",  forgotPasswordController);
router.post("/reset-password",  resetPasswordController);

export default router;