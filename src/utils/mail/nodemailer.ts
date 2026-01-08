import nodemailer from "nodemailer";

export async function sendMail({ to, subject, html }) {
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
