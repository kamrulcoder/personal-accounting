## 📧 Email Verification System (Auth Flow)
🚦 auth.routes.js
```js
// ========= Email Verification ========== //
// Send email verification link
// Verify email with token
router.post("/verify-email", protectRoute(), sendEmailVerificationController);
router.get("/verify-email/:token", protectRoute(), verifyEmailVerificationController);
```
* POST /verify-email → ইউজারকে verification link পাঠানো হবে।
* GET /verify-email/:token → ইউজারের ইমেইল verify করা হবে।

### 🛠️ auth.controllers.js
1️⃣ Send Email Verification Controller
```js
export const sendEmailVerificationController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // create verification token
    const rawToken = createEmailVerifyToken(user);
    await user.save({ validateBeforeSave: false });

    // frontend verify link
    const verificationURL = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}`;

    // send email
    await sendEmail({
      to: user.email,
      subject: "Verify Your Account",
      html: verifyEmailTemplate(user.username, verificationURL),
      text: `verify your account: ${verificationURL} (valid for 15 minutes)`,
    });

    return res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
```

👉 কাজ:

- ইউজারের ইমেইল নিয়ে token generate করা হয়।
- Email Template এর মাধ্যমে Verify Link পাঠানো হয়।

2️⃣ Verify Email Controller
```js
export const verifyEmailVerificationController = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // raw token → hashed token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // DB check
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // update user
    user.isVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
```

👉 কাজ:

- Token check করে user খোঁজা হয়।
- Valid হলে → isVerified = true করা হয়।
- Expired বা ভুল হলে → error ফেরত দেয়।

🎨 Verify Email Template
```js
export const verifyEmailTemplate = (username, verificationURL) => {
  return `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width:600px; margin:auto; background:#f4f7fb; padding:30px; border-radius:12px; border:1px solid #e0e6ed; box-shadow:0 4px 12px rgba(0,0,0,0.05);">

    <!-- Header -->
    <div style="text-align:center; margin-bottom:25px;">
      <div style="background:linear-gradient(135deg, #2F80ED, #56CCF2); padding:20px; border-radius:12px;">
        <h1 style="color:#fff; margin:0; font-size:24px;">Personal Finance</h1>
        <p style="color:#eaf4ff; font-size:14px; margin-top:8px;">Secure • Simple • Smart</p>
      </div>
    </div>

    <!-- Body -->
    <div style="background:#fff; padding:25px; border-radius:10px; border:1px solid #e0e6ed;">
      <p style="font-size:16px; color:#333;">Hi <strong>${username}</strong>,</p>
      
      <p style="font-size:15px; color:#555; line-height:1.6;">
        Thank you for signing up! To complete your registration, please verify your email 
        by clicking the button below:
      </p>

      <!-- Button -->
      <div style="text-align:center; margin:30px 0;">
        <a href="${verificationURL}" 
           style="background:linear-gradient(135deg, #2F80ED, #56CCF2); color:#fff; padding:14px 32px; 
                  text-decoration:none; border-radius:50px; font-weight:600; display:inline-block; 
                  font-size:15px; letter-spacing:0.5px; box-shadow:0 4px 10px rgba(47,128,237,0.3);">
           Verify Email
        </a>
      </div>

      <!-- Alternative link -->
      <p style="font-size:13px; color:#666;">If the button doesn’t work, copy and paste this link into your browser:</p>
      <p style="font-size:13px; word-break:break-all; color:#2F80ED;">
        <code>${verificationURL}</code>
      </p>

      <p style="font-size:12px; color:#999; margin-top:20px;">
        ⏳ This verification link will expire in <strong>15 minutes</strong>.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center; font-size:12px; color:#aaa; margin-top:25px;">
      <p style="margin:0;">&copy; ${new Date().getFullYear()} Personal Finance. All rights reserved.</p>
      <p style="margin:5px 0 0;">You are receiving this email because you created an account on Personal Finance.</p>
    </div>

  </div>
  `;
};
```

👉 Modern look:
- Gradient Header
- Rounded Button with shadow
- Expiry time shown
- Responsive container

#### 🔑 Create Email Verify Token

 ```js
import crypto from "crypto";

/**
 * ইউজারের ডকুমেন্টে reset token (hashed) ও expiry সেট করে।
 * return করে rawToken → যেটা email link এ যাবে
 */

const createEmailVerifyToken = (user) => {
  const rawToken = crypto.randomBytes(32).toString("hex"); 
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex"); 

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = Date.now() + 15 * 60 * 1000; // 15 মিনিট valid

  return rawToken;
};

export default createEmailVerifyToken;
```

👉 Flow:
- rawToken → user এর ইমেইলে যাবে।
- hashedToken → DB তে save হবে।

Expiry → 15 মিনিট।

⚡ Flow Recap
- User register/login → POST /verify-email
- Server create token → send email with link
- User clicks → GET /verify-email/:token
- Token valid → User verified ✅