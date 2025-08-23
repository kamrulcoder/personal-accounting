import crypto from "crypto";

/**
 * User ডকুমেন্টে reset token (hashed) ও expiry সেট করে।
 * রিটার্ন করে rawToken (ইমেইল লিঙ্কে যাবে)
 */
const createPasswordResetToken = (user) => {
  const rawToken = crypto.randomBytes(32).toString("hex"); // ইউজারের ইমেইলে পাঠানো হবে
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex"); // DB তে save হবে

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 মিনিটের জন্য valid

  return rawToken;
};


export default createPasswordResetToken