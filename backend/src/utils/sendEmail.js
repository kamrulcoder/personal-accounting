import nodemailer from "nodemailer";
import dotenv from "dotenv"
// Define your middleware 
dotenv.config()
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // TLS ব্যবহার করতে চাইলে true করো
  auth: {
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS
  }
});




/**
 * পাঠাবে: to, subject, html, text (optional)
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const info = await transporter.sendMail({
    from: `"Personal Finance" <kamrulcoder@gmail.com>`,
    to,
    subject,
    html,
    text,
  });
  return info;
};
