const util = require('../utility/util');
const config = require('../config');





module.exports.sendUserEmailSignUpOtpV1 = async (data) => {
    try {

        let msgBody = {};       
        const TOKEN_VALIDTY = data.tokenVaidity !== undefined && data.token != "" && data.token != 0 && data.token != null ? "This OTP is valid for next <strong style='color: #007BFF;'>"+data.tokenVaidity.toString()+" minutes</strong>. " : "" ;
        
        msgBody["SUBJECT"] = "Sign Up OTP Verification";
        msgBody["TO"] = data.email;
        msgBody["CC"] = [];
        msgBody["BCC"] = [];

        msgBody["BODY"] = `
                        <html>
                          <head>
                            <title>OTP Verification</title>
                          </head>
                          <body style="margin: 0; padding: 0; background: linear-gradient(to right, #eef2f3, #8e9eab); font-family: 'Arial', sans-serif;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px;">
                              <tr>
                                <td align="center">
                                  <table width="600px" cellpadding="0" cellspacing="0" 
                                         style="background: #ffffff; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.15); padding: 40px; text-align: center;">
                                    
                                    <!-- Header -->
                                    <tr>
                                      <td>
                                        <h2 style="color: #34495e; font-size: 18px; margin-bottom: 10px;">Your OTP Code</h2>
                                        <p style="color: #555; font-size: 14px; margin-top: 0;">Use the OTP below to complete your signup.</p>
                                      </td>
                                    </tr>

                                    <!-- OTP Code Box -->
                                    <tr>
                                      <td style="padding: 20px 0;">
                                        <div style="display: inline-block; padding: 15px 30px; font-size: 24px; font-weight: bold; color: #ffffff; background: linear-gradient(45deg, #007bff, #0056b3); border-radius: 8px; letter-spacing: 2px;">
                                          {{OTP_TOKEN}}
                                        </div>
                                      </td>
                                    </tr>

                                    <!-- Instructions -->
                                    <tr>
                                      <td>
                                        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                                          {{TOKEN_VALIDITY}} If you did not request this, please ignore this email.
                                        </p>
                                      </td>
                                    </tr>

                                    <!-- Note -->
                                    <tr>
                                      <td>
                                        <p style="color: #888; font-size: 12px; font-style: italic; margin-top: 30px;">
                                          <strong>N.B.:</strong> This is an auto-generated email. Please do not reply.
                                        </p>
                                      </td>
                                    </tr>

                                    <!-- Thanks & Regards -->
                                    <tr>
                                      <td>
                                        <p style="color: #4a5568; font-size: 14px; font-weight: bold; margin-top: 20px;">Thanks & Regards,</p>
                                        <p style="color: #4a5568; font-size: 14px;">YourCompany Team</p>
                                      </td>
                                    </tr>

                                  </table>
                                </td>
                              </tr>
                            </table>
                          </body>
                        </html>

                        `;
        
        msgBody["ATTACHMENTS"] = [];


        msgBody["BODY"] = msgBody["BODY"]
                            .replace("{{OTP_TOKEN}}", data.token)
                            .replace("{{TOKEN_VALIDITY}}", TOKEN_VALIDTY);
                            // .replace("{{COMPANY_NAME}}", config.COMPANY_NAME)
                            // .replace("{{COMPANY_ICON}}", config.COMPANY_ICON);

        resp = await util.sendEmail(msgBody);
        return true;
    } catch (err) {
        util.createLog(err)
        return (err)
    }
}

module.exports.sendUserEmailSignUpOtp = async (data) => {
    try {

        let msgBody = {};       
        const TOKEN_VALIDITY = data.tokenVaidity !== undefined && data.token != "" && data.token != 0 && data.token != null ? "This OTP is valid for next <strong style='color: #007BFF;'>"+data.tokenVaidity.toString()+" minutes</strong>. " : "" ;
        
        msgBody["SUBJECT"] = "Sign Up OTP Verification";
        msgBody["TO"] = data.email;
        msgBody["CC"] = [];
        msgBody["BCC"] = [];

        msgBody["BODY"] = `
                            <html lang="en">
                                <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>Sign-Up OTP Email</title>
                                </head>
                                <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f7f9fc; border-radius:10px;">
                                    <!-- Email Container -->
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; margin: 10px auto; border-radius: 16px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);">
                                        <!-- Header Section -->
                                        <tr>
                                            <td align="center" style="padding: 20px 20px; background: linear-gradient(135deg, #007BFF, #00BFFF); border-radius: 16px 16px 0 0;">
                                                <!-- Logo or Brand Name -->
                                                <img src={{LOGO_URL}} alt="" style="width: 150px; height: auto; margin-bottom: 20px;">
                                                <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 600;">Welcome to Our Platform!</h1>
                                                <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 10px 0 0; line-height: 1.5;">
                                                    We're excited to have you on board. Let's get started!
                                                </p>
                                            </td>
                                        </tr>

                                        <!-- Body Section -->
                                        <tr>
                                            <td style="padding: 30px 30px;">
                                                <h2 style="color: #333333; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">Verify Your Email Address</h2>
                                                <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                                    Thank you for signing up! To complete your registration, please use the following One-Time Password (OTP) to verify your email address:
                                                </p>

                                                <!-- OTP Box -->
                                                <div style="background-color: #f9f9f9; padding: 10px; text-align: center; border-radius: 12px; border: 1px solid #e0e0e0; margin-bottom: 30px;">
                                                    <p style="font-size: 36px; font-weight: bold; color: #007BFF; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">{{OTP_TOKEN}}</p>
                                                </div>

                                                <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                                    {{TOKEN_VALIDITY}}If you did not request this OTP, please ignore this email.
                                                </p>

                                                <!-- Call to Action Button -->
                                                 <!--
                                                <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 15px 0;">
                                                    <tr>
                                                        <td align="center" style="background: linear-gradient(135deg, #007BFF, #00BFFF); border-radius: 8px; transition: background 0.3s ease;">
                                                            <a href="#" style="display: inline-block; padding: 14px 28px; color: #ffffff; font-size: 16px; text-decoration: none; font-weight: bold; border-radius: 8px; transition: transform 0.3s ease;">
                                                                Verify Email
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </table>
                                                -->

                                                <!-- Thanks & Regards Section -->
                                                <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 30px 0 0;">
                                                    Thanks & Regards,<br>
                                                    <strong>The Team at Your Company</strong>
                                                </p>

                                                <!-- Auto-Generated Mail Disclaimer -->
                                                <p style="color: #777777; font-size: 12px; line-height: 1.6; margin: 20px 0 0;">
                                                    <em>This is an auto-generated email. Please do not reply to this message. If you have any questions, feel free to contact us at <a href="mailto:support@example.com" style="color: #007BFF; text-decoration: none;">support@example.com</a>.</em>
                                                </p>
                                            </td>
                                        </tr>

                                        <!-- Footer Section -->
                                        <tr>
                                            <td align="center" style="padding: 20px 0; background-color: #f1f1f1; border-radius: 0 0 16px 16px;">
                                                <p style="color: #777777; font-size: 14px; margin: 0;">
                                                    &copy; 2023 Your Company. All rights reserved.
                                                </p>
                                                <!--
                                                <p style="color: #777777; font-size: 12px; margin: 10px 0 0;">
                                                    <a href="#" style="color: #007BFF; text-decoration: none;">Privacy Policy</a> | <a href="#" style="color: #007BFF; text-decoration: none;">Terms of Service</a>
                                                </p>-->
                                            </td>
                                        </tr>
                                    </table>
                                </body>
                            </html>
                        `;
        
        msgBody["ATTACHMENTS"] = [];


        msgBody["BODY"] = msgBody["BODY"]
                            .replace("{{OTP_TOKEN}}", data.token)
                            .replace("{{TOKEN_VALIDITY}}", TOKEN_VALIDITY);
                            // .replace("{{COMPANY_NAME}}", config.COMPANY_NAME)
                            // .replace("{{COMPANY_LOGO_URL}}", config.COMPANY_LOGO_URL);

        resp = await util.sendEmail(msgBody);
        return true;
    } catch (err) {
        util.createLog(err)
        return (err)
    }
}


module.exports.sendUserMobileSignUpOtp = async (data) => {
    try {

        let msgBody = {};       
        const TOKEN_VALIDTY = data.tokenVaidity !== undefined && data.token != "" && data.token != 0 && data.token != null ? "This OTP is valid for <b>**"+data.tokenVaidity.toString()+" minutes**</b>. " : "" ;
        
        msgBody["SUBJECT"] = "Sign Up OTP Verification";
        msgBody["TO"] = data.email;
        msgBody["CC"] = [];
        msgBody["BCC"] = [];

        msgBody["BODY"] = `<html>
                          <body style="margin: 0; padding: 0; background-color: #f7f9fc; font-family: 'Arial', sans-serif, border-radius:10px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f9fc; padding: 20px;">
                              <tr>
                                <td align="center">
                                  <table width="100%" max-width="600px" cellpadding="0" cellspacing="0" 
                                         style="background: #ffffff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); padding: 40px; text-align: center;">
                                    
                                    <!-- Logo -->
                                    <!--
                                    <tr>
                                      <td style="padding-bottom: 20px;">
                                        <img src="{{LOGO_URL}}" alt="Company Logo" style="width: 120px; height: auto;">
                                      </td>
                                    </tr>
                                    -->

                                    <!-- Header -->
                                    <tr>
                                      <td>
                                        <h2 style="color: #4a5568; font-size: 16px; margin-top: 8px;">Please enter the below OTP to Sign Up.</h2>
                                      </td>
                                    </tr>

                                    <!-- OTP Code Box -->
                                    <tr>
                                      <td style="padding: 20px 0;">
                                        <div style="display: inline-block; padding: 15px 30px; font-size: 24px; font-weight: bold; color: #fff; background: #007bff; border-radius: 8px; letter-spacing: 2px;">
                                          {{OTP_TOKEN}}
                                        </div>
                                      </td>
                                    </tr>

                                    <!-- CTA Button -->
                                    <!--
                                    <tr>
                                      <td style="padding: 20px 0;">
                                        <a href="{{RESET_LINK}}" 
                                           style="display: inline-block; background: #007bff; color: #ffffff; text-decoration: none; padding: 12px 30px; font-size: 16px; font-weight: bold; border-radius: 6px;">
                                          Reset Password
                                        </a>
                                      </td>
                                    </tr>
                                    -->

                                    <!-- Instructions -->
                                    <tr>
                                      <td>
                                        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                                          {{TOKEN_VALIDITY}}If you did not request this, please ignore this email.
                                        </p>
                                      </td>
                                    </tr>

                                    <!-- Footer -->
                                    <!-- 
                                    <tr>
                                      <td>
                                        <hr style="border: 0; height: 1px; background-color: #ddd; margin: 20px 0;">
                                        <p style="color: #888; font-size: 12px;">
                                          Need help? <a href="{{SUPPORT_LINK}}" style="color: #007bff; text-decoration: none;">Contact Support</a>
                                        </p>
                                        <p style="color: #aaa; font-size: 12px;">&copy; 2025 YourCompany. All rights reserved.</p>
                                      </td>
                                    </tr>
                                    -->

                                  </table>
                                </td>
                              </tr>
                            </table>
                          </body>
                        </html>
                        `;
        
        msgBody["ATTACHMENTS"] = [];


        msgBody["BODY"] = msgBody["BODY"]
                            .replace("{{OTP_TOKEN}}", data.token)
                            .replace("{{TOKEN_VALIDITY}}", TOKEN_VALIDTY);
                            // .replace("{{LOGO_URL}}", "https://yourwebsite.com/logo.png")
                            // .replace("{{SUPPORT_LINK}}", "https://yourwebsite.com/support");

        resp = await util.sendEmail(msgBody);
        return true;
    } catch (err) {
        util.createLog(err)
        return (err)
    }
}



module.exports.sendUserEmailSignInOtp = async (data) => {
    try {

        let msgBody = {};       
        const TOKEN_VALIDITY = data.tokenVaidity !== undefined && data.token != "" && data.token != 0 && data.token != null ? "This OTP is valid for next <strong style='color: #007BFF;'>"+data.tokenVaidity.toString()+" minutes</strong>. " : "" ;
        
        msgBody["SUBJECT"] = "Sign In OTP Verification";
        msgBody["TO"] = data.email;
        msgBody["CC"] = [];
        msgBody["BCC"] = [];

        msgBody["BODY"] = `
                            <html lang="en">
                                <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>Sign-In Verification Email</title>
                                </head>
                                <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f7f9fc; border-radius:10px;">
                                    <!-- Email Container -->
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; margin: 10px auto; border-radius: 16px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);">
                                        <!-- Header Section -->
                                        <tr>
                                            <td align="center" style="padding: 20px 20px; background: linear-gradient(135deg, #007BFF, #00BFFF); border-radius: 16px 16px 0 0;">
                                                <!-- Logo or Brand Name -->
                                                <img src="" alt="" style="width: 150px; height: auto; margin-bottom: 20px;">
                                                <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 600;">Sign-In Verification</h1>
                                                <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 10px 0 0; line-height: 1.5;">
                                                    Secure your account with an extra layer of protection.
                                                </p>
                                            </td>
                                        </tr>

                                        <!-- Body Section -->
                                        <tr>
                                            <td style="padding: 30px 30px;">
                                                <h2 style="color: #333333; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">Verify Your Sign-In Attempt</h2>
                                                <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                                    We noticed a sign-in attempt on your account. To ensure it's you, please use the following One-Time Password (OTP) to verify your identity:
                                                </p>

                                                <!-- OTP Box -->
                                                <div style="background-color: #f9f9f9; padding: 10px; text-align: center; border-radius: 12px; border: 1px solid #e0e0e0; margin-bottom: 30px;">
                                                    <p style="font-size: 36px; font-weight: bold; color: #007BFF; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">{{OTP_TOKEN}}</p>
                                                </div>

                                                <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                                    {{TOKEN_VALIDITY}}If you did not attempt to sign in, please secure your account immediately.
                                                </p>

                                                <!-- Call to Action Button -->
                                                <!--<table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 15px 0;">
                                                    <tr>
                                                        <td align="center" style="background: linear-gradient(135deg, #007BFF, #00BFFF); border-radius: 8px; transition: background 0.3s ease;">
                                                            <a href="#" style="display: inline-block; padding: 14px 28px; color: #ffffff; font-size: 16px; text-decoration: none; font-weight: bold; border-radius: 8px; transition: transform 0.3s ease;">
                                                                Verify Sign-In
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </table>-->

                                                <!-- Thanks & Regards Section -->
                                                <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 30px 0 0;">
                                                    Thanks & Regards,<br>
                                                    <strong>The Team at Your Company</strong>
                                                </p>

                                                <!-- Auto-Generated Mail Disclaimer -->
                                                <p style="color: #777777; font-size: 12px; line-height: 1.6; margin: 20px 0 0;">
                                                    <em>This is an auto-generated email. Please do not reply to this message. If you have any questions, feel free to contact us at <a href="mailto:support@example.com" style="color: #007BFF; text-decoration: none;">support@example.com</a>.</em>
                                                </p>
                                            </td>
                                        </tr>

                                        <!-- Footer Section -->
                                        <tr>
                                            <td align="center" style="padding: 20px 0; background-color: #f1f1f1; border-radius: 0 0 16px 16px;">
                                                <p style="color: #777777; font-size: 14px; margin: 0;">
                                                    &copy; 2023 Your Company. All rights reserved.
                                                </p>
                                                <p style="color: #777777; font-size: 12px; margin: 10px 0 0;">
                                                    <a href="#" style="color: #007BFF; text-decoration: none;">Privacy Policy</a> | <a href="#" style="color: #007BFF; text-decoration: none;">Terms of Service</a>
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </body>
                            </html>
                        `;
        
        msgBody["ATTACHMENTS"] = [];


        msgBody["BODY"] = msgBody["BODY"]
                            .replace("{{OTP_TOKEN}}", data.token)
                            .replace("{{TOKEN_VALIDITY}}", TOKEN_VALIDITY);
                            // .replace("{{COMPANY_NAME}}", config.COMPANY_NAME)
                            // .replace("{{COMPANY_LOGO_URL}}", config.COMPANY_LOGO_URL);

        resp = await util.sendEmail(msgBody);
        return true;
    } catch (err) {
        util.createLog(err)
        return (err)
    }
}





module.exports.sendUserEmailForgetPasswordOtp = async (data) => {
    try {

        let msgBody = {};       
        const TOKEN_VALIDITY = data.tokenVaidity !== undefined && data.token != "" && data.token != 0 && data.token != null ? "This OTP is valid for next <strong style='color: #007BFF;'>"+data.tokenVaidity.toString()+" minutes</strong>. " : "" ;
        
        msgBody["SUBJECT"] = "Forget Password OTP Verification";
        msgBody["TO"] = data.email;
        msgBody["CC"] = [];
        msgBody["BCC"] = [];

        msgBody["BODY"] = `
                            <html lang="en">
                                <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>Forgot Password Email</title>
                                </head>
                                <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f7f9fc; border-radius:10px;">
                                    <!-- Email Container -->
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; margin: 10px auto; border-radius: 16px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);">
                                        <!-- Header Section -->
                                        <tr>
                                            <td align="center" style="padding: 20px 20px; background: linear-gradient(135deg, #007BFF, #00BFFF); border-radius: 16px 16px 0 0;">
                                                <!-- Logo or Brand Name -->
                                                <img src="" alt="" style="width: 150px; height: auto; margin-bottom: 20px;">
                                                <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 600;">Password Reset Request</h1>
                                                <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 10px 0 0; line-height: 1.5;">
                                                    Let's get you back into your account.
                                                </p>
                                            </td>
                                        </tr>

                                        <!-- Body Section -->
                                        <tr>
                                            <td style="padding: 30px 30px;">
                                                <h2 style="color: #333333; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">Reset Your Password</h2>
                                                <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                                    We received a request to reset your password. Use the following One-Time Password (OTP) to verify your identity and reset your password:
                                                </p>

                                                <!-- OTP Box -->
                                                <div style="background-color: #f9f9f9; padding: 10px; text-align: center; border-radius: 12px; border: 1px solid #e0e0e0; margin-bottom: 30px;">
                                                    <p style="font-size: 36px; font-weight: bold; color: #007BFF; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">{{OTP_TOKEN}}</p>
                                                </div>

                                                <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                                    {{TOKEN_VALIDITY}}If you did not request a password reset, please ignore this email.
                                                </p>

                                                <!-- Call to Action Button -->
                                                <!--<table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 15px 0;">
                                                    <tr>
                                                        <td align="center" style="background: linear-gradient(135deg, #007BFF, #00BFFF); border-radius: 8px; transition: background 0.3s ease;">
                                                            <a href="#" style="display: inline-block; padding: 14px 28px; color: #ffffff; font-size: 16px; text-decoration: none; font-weight: bold; border-radius: 8px; transition: transform 0.3s ease;">
                                                                Reset Password
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </table>-->

                                                <!-- Thanks & Regards Section -->
                                                <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 30px 0 0;">
                                                    Thanks & Regards,<br>
                                                    <strong>The Team at Your Company</strong>
                                                </p>

                                                <!-- Auto-Generated Mail Disclaimer -->
                                                <p style="color: #777777; font-size: 12px; line-height: 1.6; margin: 20px 0 0;">
                                                    <em>This is an auto-generated email. Please do not reply to this message. If you have any questions, feel free to contact us at <a href="mailto:support@example.com" style="color: #007BFF; text-decoration: none;">support@example.com</a>.</em>
                                                </p>
                                            </td>
                                        </tr>

                                        <!-- Footer Section -->
                                        <tr>
                                            <td align="center" style="padding: 20px 0; background-color: #f1f1f1; border-radius: 0 0 16px 16px;">
                                                <p style="color: #777777; font-size: 14px; margin: 0;">
                                                    &copy; 2023 Your Company. All rights reserved.
                                                </p>
                                                <p style="color: #777777; font-size: 12px; margin: 10px 0 0;">
                                                    <a href="#" style="color: #007BFF; text-decoration: none;">Privacy Policy</a> | <a href="#" style="color: #007BFF; text-decoration: none;">Terms of Service</a>
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </body>
                            </html>
                        `;
        
        msgBody["ATTACHMENTS"] = [];


        msgBody["BODY"] = msgBody["BODY"]
                            .replace("{{OTP_TOKEN}}", data.token)
                            .replace("{{TOKEN_VALIDITY}}", TOKEN_VALIDITY);
                            // .replace("{{COMPANY_NAME}}", config.COMPANY_NAME)
                            // .replace("{{COMPANY_LOGO_URL}}", config.COMPANY_LOGO_URL);

        resp = await util.sendEmail(msgBody);
        return true;
    } catch (err) {
        util.createLog(err)
        return (err)
    }
}