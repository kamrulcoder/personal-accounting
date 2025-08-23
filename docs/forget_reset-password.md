## 1️⃣ auth.routes.js

```js
// ========= forgot, reset password ========== //
// Password reset
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
```
- /forgot-password → user email দিয়ে password reset request করবে
- /reset-password → user email link থেকে নতুন password সেট করবে

## 2️⃣ auth.controllers.js
Forgot Password Controller


```js 
export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const rawToken = createPasswordResetToken(user);
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;
    
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: resetPasswordEmailTemplate(user.username, resetURL),
      text: `Reset your password: ${resetURL} (valid for 15 minutes)`
    });

    return res.status(200).json({ message: "Password reset email sent" });

  } catch (error) {
    // Cleanup if something goes wrong
    try {
      if (req.body.email) {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
          user.passwordResetToken = null;
          user.passwordResetExpires = null;
          await user.save({ validateBeforeSave: false });
        }
      }
    } catch (_) {}
    
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
```



Reset Password Controller

```js 
export const resetPasswordController = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.passwordHash = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
```

## 3️⃣ createPasswordResetToken.js
```js 
import crypto from "crypto";

/**
 * User ডকুমেন্টে reset token (hashed) ও expiry সেট করে।
 * রিটার্ন করে rawToken (ইমেইল লিঙ্কে যাবে)
 */
const createPasswordResetToken = (user) => {
  const rawToken = crypto.randomBytes(32).toString("hex"); // ইউজারের ইমেইলে পাঠানো হবে
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex"); // DB তে save হবে

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 মিনিট valid

  return rawToken;
};

export default createPasswordResetToken;
```

## 4️⃣ Reset Password Email Template

```js 
export const resetPasswordEmailTemplate = (username, resetURL) => {
  return `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height:1.6; color:#333; max-width:600px; margin:auto; padding:30px; border-radius:12px; background-color:#ffffff; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
    <div style="text-align:center; margin-bottom:30px;">
      <h1 style="color:#2F80ED; font-size:24px; margin:0;">Password Reset Request</h1>
    </div>

    <p style="font-size:16px;">Hi <strong>${username}</strong>,</p>
    <p style="font-size:16px; color:#555;">
      You recently requested to reset your password for your Personal Finance account. Click the button below to reset it. 
      If you didn’t request a password reset, please ignore this email.
    </p>

    <div style="text-align:center; margin:30px 0;">
      <a href="${resetURL}" 
         style="display:inline-block; padding:14px 28px; background:linear-gradient(90deg,#2F80ED,#56CCF2); color:#fff; text-decoration:none; border-radius:8px; font-weight:bold; font-size:16px; box-shadow:0 4px 8px rgba(47,128,237,0.3); transition:all 0.3s ease;">
         Reset Password
      </a>
    </div>

    <p style="font-size:14px; color:#555;">
      Or copy and paste this URL into your browser:
      <br/>
      <a href="${resetURL}" style="color:#2F80ED; word-break:break-all;">${resetURL}</a>
    </p>

    <p style="font-size:12px; color:#999; margin-top:40px;">
      This link will expire in <strong>15 minutes</strong> for your security.
    </p>

    <hr style="border:none; border-top:1px solid #eee; margin:30px 0;" />

    <p style="font-size:12px; color:#999; text-align:center;">
      &copy; ${new Date().getFullYear()} Personal Finance. All rights reserved.
    </p>
  </div>
  `;
};
```

## 5️⃣ sendEmail.js
```js 
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // TLS ব্যবহার করতে চাইলে true করুন
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Email পাঠাবে: to, subject, html, text (optional)
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const info = await transporter.sendMail({
    from: `"Personal Finance" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text,
  });
  return info;
};
```

🔑 Key Points
- Token lifetime → 15 মিনিট
- Raw token → user email এ যাবে, hashed token → DB তে save হবে
- Validation → resetPasswordController এ hashed token + expiry check
- Email Template → modern, gradient button, responsive readable
- sendEmail → Nodemailer ব্যবহার করে SMTP server থেকে email পাঠানো