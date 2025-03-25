import {signupVerificationTemplate, welcomeEmailTemplate} from './template.js';
import { client, sender} from "./mailsconfig.js";
export const sendVerificationEmail =  (email, verificationToken) => {
      client.send({
        from: sender,
        to: [{ email: email }],
        subject: "Verify your email",
        html: signupVerificationTemplate.replace("{VERIFICATION_TOKEN}",verificationToken),
        category: "Email Verification",
      })  .then(console.log("Email sent successfully"))
      .catch((error) => console.error("Error while sending email",error));
    }
