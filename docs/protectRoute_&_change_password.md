## 🔐 Change Password (Authenticated Users)

এই নোটে দেখানো হয়েছে কিভাবে protect route ব্যবহার করে logged-in user তার password পরিবর্তন করতে পারে।

```js 
1️⃣ Protect Route Middleware
// protectRoute.js (example)
// এই middleware নিশ্চিত করে যে শুধুমাত্র authenticated user route access করতে পারবে

import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const protectRoute = () => async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "You are not logged in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user; // attach user to request object
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

```
> 💡 Middleware ব্যবহার করলে route access করার আগে user authentication validate হবে।

### 2️⃣ Change Password Route

```js 
// auth.routes.js

// change password route (logged-in users only)
router.post("/change-password", protectRoute(), changePasswordController);
```

- Route এ protectRoute() middleware ব্যবহার করা হয়েছে
- শুধুমাত্র authenticated users password change করতে পারবে

### 3️⃣ Change Password Controller
```js 
export const changePasswordController = async (req, res) => {
  const userId = req.user._id;

  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Check all fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate new password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }

    // Find user in DB with passwordHash
    const user = await User.findById(userId).select("+passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Update password
    user.passwordHash = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
```

4️⃣ Key Notes

- protectRoute middleware ব্যবহার করলে route secure হয়।
- Validation:
    - সব field পূরণ করা আছে কি না
    - New password এবং confirm password মিলছে কি না
    - Current password সঠিক কি না
- Password update → DB তে save করার পরে user এর password পরিবর্তিত হয়
- Error handling → 400 / 401 / 404 / 500 অনুযায়ী response দেয়