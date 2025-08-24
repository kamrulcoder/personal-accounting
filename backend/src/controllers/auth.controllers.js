
// backend/src/controllers/auth.controllers.js
import User from '../models/User.model.js';
import createEmailVerifyToken from '../utils/createEmailVerifyToken.js';
import createPasswordResetToken from '../utils/createPasswordResetToken.js';
import { resetPasswordEmailTemplate, verifyEmailTemplate } from '../utils/emailTemplete.js';
import generateTokenAndSetCookie from '../utils/generateToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';

export const registerController = async (req, res) => {

    try {
        const { username, email, password } = req.body;

        // check all fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // check existing user 
        const existingUser = await User.findOne({ email });

        // check if user already exists
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        } else {
            // create new user
            const newUser = new User({ username, email, passwordHash: password });
            await newUser.save();
            generateTokenAndSetCookie(newUser._id, res);
            return res.status(201).json({ message: 'User registered successfully' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        // check all fields are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        //  find user by email
        const user = await User.findOne({ email }).select('+passwordHash');

        // not found user
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // is match password from database by bcrypt
        const isMatch = await user.comparePassword(password)
        // not match password
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const { passwordHash, ...userData } = user.toObject()
        generateTokenAndSetCookie(user._id, res);
        return res.status(200).json({ message: 'Login successful', user: userData });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
export const logoutController = async (req, res) => {
    res.cookie("jwt", "", {
        maxAge: 0, // MS
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development",
    });
    return res.status(200).json({ message: 'Logout successful' });
}


export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;
        // check all fields are provided
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        // find user by email
        const user = await User.findOne({ email });
        // not found user
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // created reset token
        const rawToken = createPasswordResetToken(user);
        await user.save({ validateBeforeSave: false }); // save user without validation

        // RESET URL (FRONTEND PAGE)

        const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;
        await sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            html: resetPasswordEmailTemplate(user.username, resetURL),
            text: ` Reset your password: ${resetURL} (valid for 15 minutes) `
        });
        return res.status(200).json({ message: 'Password reset email sent' });

    } catch (error) {
        try {
            if (req.body.email) {
                const user = await User.findOne({ email: req.body.email });
                if (user) {
                    user.passwordResetToken = null;
                    user.passwordResetExpires = null;
                    await user.save({ validateBeforeSave: false }); // save user without validation
                }

            }
        } catch (_) {
            // ignore   error    
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
export const resetPasswordController = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // user থেকে আসা raw token কে hash করে DB এর সাথে match করা
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // DB থেকে user খুঁজে বের করা
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }, // token expired check
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // password update করা
        user.passwordHash = password;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;

        await user.save();

        return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const changePasswordController = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New password and confirm password do not match" });
        }
        const user = await User.findById(userId).select("+passwordHash");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }
        user.passwordHash = newPassword;
        await user.save();
        return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}



export const sendEmailVerificationController = async (req, res) => {
    try {
        const { email } = req.body;
        // check all fields are provided
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        // find user by email
        const user = await User.findOne({ email });
        // not found user
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // create verification token
        const rawToken = createEmailVerifyToken(user);
        await user.save({ validateBeforeSave: false }); // save user without validation

        // VERIFICATION URL (FRONTEND PAGE)
        const verificationURL = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}`;

        await sendEmail({
            to: user.email,
            subject: 'Verify Your Account',
            html: verifyEmailTemplate(user.username, verificationURL),
            text: `verify  your account : ${verificationURL} (valid for 15 minutes)`,
        });

        return res.status(200).json({ message: 'Verification email sent' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


export const verifyEmailVerificationController = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        // user থেকে আসা raw token কে hash করে DB এর সাথে match করা
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // DB থেকে user খুঁজে বের করা
        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpires: { $gt: Date.now() }, // token expired check
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // email verified করা
        user.isVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;

        await user.save();

        return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}