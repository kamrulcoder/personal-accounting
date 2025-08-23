
// backend/src/controllers/auth.controllers.js
import User from '../models/User.model.js';
import generateTokenAndSetCookie from '../utils/generateToken.js';

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