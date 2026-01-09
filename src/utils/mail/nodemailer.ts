import nodemailer from "nodemailer";

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: SendMailOptions) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "alimohameddev35@gmail.com",
      pass: "gein dgnl xyva uhwd",
    },
  });

  await transporter.sendMail({
    from: '"Ali Mohamed" <alimohameddev35@gmail.com>',
    to,
    subject,
    html,
  });
}
