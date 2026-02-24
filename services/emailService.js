import nodemailer from "nodemailer";
console.log(process.env.ZOHO_EMAIL);
console.log(process.env.ZOHO_APP_PASSWORD);

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_APP_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Auth System" <${process.env.ZOHO_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email failed:", error);
    throw new Error("Email sending failed");
  }
};
