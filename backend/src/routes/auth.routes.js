// src/routes/auth.routes.js

import express from 'express';
import {   forgotPasswordController, loginController, logoutController, registerController, resetPasswordController, sendEmailVerificationController, verifyEmailVerificationController,  } from '../controllers/auth.controllers.js';
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



// ========= Email Verification ========== //
// Send email verification link
// Verify email with token
router.post("/verify-email", protectRoute(), sendEmailVerificationController);
router.get("/verify-email/:token", protectRoute(), verifyEmailVerificationController);

export default router;