## 🔐 Auth Operations (Authentication)

আমি login, register, logout ফিচারগুলো সম্পন্ন করেছি।

## 1️⃣ Auth Routes (auth.routes.js)
```js
router.post('/register', registerController); 
router.post('/login', loginController);
router.post('/logout', logoutController);
```

/register → নতুন ইউজার রেজিস্টার করার জন্য

/login → ইউজার লগইন করার জন্য

/logout → ইউজার লগআউট করার জন্য

## 2️⃣ Auth Controllers (auth.controllers.js)
Register Controller
```js
export const registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // ⚠️ সব ফিল্ড ভরা আছে কি না চেক করা
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // 🔍 ইমেইল দিয়ে ইউজার আছে কি না চেক
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        } 

        // ✅ নতুন ইউজার তৈরি করা
        const newUser = new User({ username, email, passwordHash: password });
        await newUser.save();

        // 🔑 JWT Token তৈরি ও কুকিতে সেট করা
        generateTokenAndSetCookie(newUser._id, res);
        return res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
```
Login Controller
```js
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ⚠️ সব ফিল্ড ভরা আছে কি না চেক করা
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // 🔍 ইমেইল দিয়ে ইউজার খুঁজে পাওয়া
        const user = await User.findOne({ email }).select('+passwordHash');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 🔐 পাসওয়ার্ড মিলেছে কি না চেক করা
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const { passwordHash, ...userData } = user.toObject();
        generateTokenAndSetCookie(user._id, res);

        return res.status(200).json({ message: 'Login successful', user: userData });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
```
Logout Controller
```js
export const logoutController = async (req, res) => {
    res.cookie("jwt", "", {
        maxAge: 0, // কুকি মুছে দেওয়া
        httpOnly: true, // XSS আক্রমণ প্রতিরোধ
        sameSite: "strict", // CSRF আক্রমণ প্রতিরোধ
        secure: process.env.NODE_ENV !== "development",
    });
    return res.status(200).json({ message: 'Logout successful' });
}
```
3️⃣ Generate Token & Set Cookie (generateToken.js)
```js
import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
    // 🔑 JWT Token তৈরি
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });

    // 🍪 কুকিতে সেট করা
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 দিন
        httpOnly: true, // XSS আক্রমণ প্রতিরোধ
        sameSite: "strict", // CSRF আক্রমণ প্রতিরোধ
        secure: process.env.NODE_ENV !== "development",
    });
}

export default generateTokenAndSetCookie;
```

✅ নোট:
- registerController → নতুন ইউজার তৈরি করে এবং JWT সেট করে
- loginController → ইউজারের তথ্য যাচাই করে লগইন এবং JWT সেট করে
- logoutController → কুকি মুছে দিয়ে লগআউট করে
- generateTokenAndSetCookie → Token তৈরি ও কুকিতে সেট করার ইউটিলিটি