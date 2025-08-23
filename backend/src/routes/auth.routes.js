// src/routes/auth.routes.js

import express from 'express';
import {  changePasswordController, forgotPasswordController, loginController, logoutController, registerController, resetPasswordController,  } from '../controllers/auth.controllers.js';
import protectRoute from '../middlewares/authMiddleware.js';
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

// change password (protected route) can be added later
router.post("/change-password", protectRoute(), changePasswordController);

export default router;