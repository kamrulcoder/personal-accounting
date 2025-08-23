## 🚀 প্রোজেক্ট ডকুমেন্টেশন
### 📦 ব্যবহৃত NPM প্যাকেজসমূহ

প্রোজেক্টে যেসব প্যাকেজ ব্যবহার করা হয়েছে:

```bash 
npm i bcryptjs cookie-parser cors crypto dotenv express jsonwebtoken mongoose multer nodemailer sharp
```
📊 প্যাকেজগুলোর কাজ: 

| প্যাকেজ           | কাজ (সহজ ভাষায়)                                                             |
| ----------------- | --------------------------------------------------------------------------- |
| **bcryptjs**      | পাসওয়ার্ড **হ্যাশ/এনক্রিপ্ট** করে রাখে, যাতে আসল পাসওয়ার্ড ডাটাবেজে না যায়। |
| **cookie-parser** | ব্রাউজার ও সার্ভারের মধ্যে **কুকি পড়া ও লেখা** সহজ করে।                     |
| **cors**          | ফ্রন্টএন্ড (React ইত্যাদি) কে **ব্যাকএন্ডের সাথে নিরাপদে কানেক্ট** হতে দেয়। |
| **crypto**        | **এনক্রিপশন ও র‍্যান্ডম স্ট্রিং** বানাতে কাজে লাগে (যেমন রিসেট টোকেন)।      |
| **dotenv**        | `.env` ফাইল থেকে **সিক্রেট ভ্যালু/কনফিগারেশন লোড** করে।                     |
| **express**       | মূল **ওয়েব সার্ভার ফ্রেমওয়ার্ক** – রাউট, রিকোয়েস্ট-রেসপন্স হ্যান্ডেল করে।   |
| **jsonwebtoken**  | ইউজার **JWT টোকেন তৈরি ও যাচাই** করতে ব্যবহার হয় (অথেনটিকেশন)।              |
| **mongoose**      | MongoDB এর সাথে কানেক্ট ও কাজ করার জন্য **সহজ টুল** (ODM)।                  |
| **multer**        | **ফাইল আপলোড** (যেমন প্রোফাইল ছবি) হ্যান্ডেল করে।                           |
| **nodemailer**    | **ইমেইল পাঠাতে** ব্যবহৃত হয় (যেমন ভেরিফিকেশন, পাসওয়ার্ড রিসেট লিঙ্ক)।       |
| **sharp**         | **ইমেজ প্রসেসিং** (সাইজ ছোট করা, রিসাইজ করা ইত্যাদি)।                       |


## ⚙️ server.js

এটি হচ্ছে ব্যাকএন্ডের মূল ফাইল।

এখানে ৩টা বড় কাজ করা হয় –

- .env থেকে কনফিগারেশন লোড।
- সব middlewares ও routes অ্যাপ্লাই করা।
- ডাটাবেজ কানেক্ট করে সার্ভার চালু করা।

```js 
// src/server.js 
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDb.js';
import { globalMiddlewares, routes } from './config/appConfig.js';

// সার্ভার তৈরি
const app = express();
dotenv.config();

// সব middleware একসাথে ইউজ
app.use(...globalMiddlewares);

// সব route ইউজ
routes.forEach((route) => {
  app.use(route.path, route.router);
});

// ডাটাবেজ কানেক্ট + সার্ভার চালু
connectDB(app);
```

## 🛠️ appConfig.js

এটি তৈরি করার মূল কারণ হলো server.js কে ছোট আর পরিষ্কার রাখা।

এখানে সব middlewares আর routes এক জায়গায় রাখা হয়।

```js 
// src/config/appConfig.js 
import authRoutes from '../routes/auth.routes.js';
import userRoutes from '../routes/user.routes.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

export const globalMiddlewares = [
    express.json(), // JSON ডাটা বুঝবে
    express.urlencoded({ extended: true }),
    cors({
        origin: 'http://localhost:5173',
        credentials: true
    }),
    cookieParser(),
    // চাইলে আরও middleware এখানে যোগ করা যাবে
];

// সব route 
export const routes = [
    { path: '/api/auth', router: authRoutes },
    { path: '/api/users', router: userRoutes },
    // চাইলে নতুন route এখানে যোগ করো...
];
```
👉 কেন ভালো হয়েছে?
- server.js ছোট হয়ে গেছে।
- ভবিষ্যতে নতুন middleware বা route অ্যাড করা সহজ।

## 🗄️ connectDb.js 
এই ফাইল ডাটাবেজ কানেকশন ও সার্ভার চালানোর দায়িত্বে।

```js 
// src/config/connectDb.js 
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;

const connectDB = async (app) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

export default connectDB;
```