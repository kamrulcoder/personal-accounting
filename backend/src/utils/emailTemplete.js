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

`
}   