import transporter from "./transporter.js";

export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.GMAIL_FROM_USER,
    to,
    subject,
    html,
  });
};
