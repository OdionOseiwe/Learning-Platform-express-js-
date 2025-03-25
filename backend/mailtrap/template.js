export const signupVerificationTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #333;">
  <div style="max-width: 600px; margin: 50px auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="color: #4CAF50;">Email Verification</h1>
    </div>
    <div style="text-align: center;">
      <p style="font-size: 16px;">Hi There,</p>
      <p style="font-size: 16px;">Thank you for signing up! Please use the following token to verify your email address:</p>

      <!-- Token Display -->
      <div style="display: inline-block; background-color: #f0f0f0; color: #333; padding: 10px 20px; border-radius: 5px; font-size: 18px; margin-top: 20px;">
        {VERIFICATION_TOKEN}
      </div>

      <p style="font-size: 16px; margin-top: 20px;">Copy the above token and paste it on the verification page.</p>
      <p style="font-size: 16px;">If you did not create an account, no further action is required.</p>
    </div>
    <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #777;">
      <p>© 2024 Mine. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`

export const welcomeEmailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Mine</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #333;">
  <div style="max-width: 600px; margin: 50px auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="color: #4CAF50;">Welcome to Mine!</h1>
    </div>
    <div style="text-align: center;">
      <p style="font-size: 16px;">Hi {USER},</p>
      <p style="font-size: 16px;">We're excited to have you on board! Thank you for joining Mine.</p>
      <p style="font-size: 16px;">Here are a few things you can do to get started:</p>
      <ul style="text-align: left; padding: 0 30px;">
        <li style="font-size: 16px; margin-bottom: 10px;">Explore your dashboard</li>
        <li style="font-size: 16px; margin-bottom: 10px;">Set up your profile</li>
        <li style="font-size: 16px; margin-bottom: 10px;">Check out our latest features</li>
      </ul>
      <p style="font-size: 16px;">If you have any questions, feel free to reach out to our support team. We're here to help!</p>
      <p style="font-size: 16px;">Welcome again, and we look forward to working with you!</p>
    </div>
    <div style="text-align: center; margin-top: 30px;">
      <p style="font-size: 16px;">Best regards,</p>
      <p style="font-size: 16px;">The Mine Team</p>
    </div>
    <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #777;">
      <p>© 2024 Mine. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`

export const forgetPasswordEmailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">

    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="text-align: center; padding-bottom: 20px;">
                            <h1 style="color: #333; font-size: 24px; margin: 0;">Reset Your Password</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px; color: #555; line-height: 1.6;">
                            <p>Hi,</p>
                            <p>It looks like you requested to reset your password. Click the button below to set a new password for your account:</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center; padding: 20px 0;">
                            <a href="{RESET_LINK}" style="background-color: #007BFF; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-size: 16px;">Reset Password</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px; color: #555; line-height: 1.6;">
                            <p>If you didn’t request this, please ignore this email.</p>
                            <p>Thank you,<br>Your Company</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

</body>
</html>
`

export const sendPasswordResetSucessfulTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Success Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">

    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="text-align: center; padding-bottom: 20px;">
                            <h1 style="color: #28a745; font-size: 24px; margin: 0;">Success!</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px; color: #555; line-height: 1.6; text-align: center;">
                            <p>Hi,</p>
                            <p>We’re excited to let you know that your recent action was successful.</p>
                            <p style="font-weight: bold;">password set sucessfully</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center; padding: 20px 0;">
                            <a href="[LINK_URL]" style="background-color: #007BFF; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-size: 16px;">View Details</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px; color: #555; line-height: 1.6; text-align: center;">
                            <p>Thank you for choosing us!</p>
                            <p>Best regards,<br>Your Company</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

</body>
</html>
`