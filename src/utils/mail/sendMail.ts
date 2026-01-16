import { Resend } from "resend";

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

const EMAIL_FROM = process.env.EMAIL_FROM || "Clinical App <noreply@otp.clinico.com>";

export async function sendMail({ to, subject, html }: SendMailOptions) {
  try {
    console.log("Sending email to:", to);
    console.log("API Key exists:", !!process.env.RESEND_API_KEY);
    
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });
    
    console.log("Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}
