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
        ⏳ This verification link will expire in <strong>15  minutes</strong>.
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
