import { baseLayout } from "./layout.js";

export const resetOtpTemplate = (otp) => {
  const content = `
    <p>Use the OTP below to reset your password:</p>
    <h1 style="letter-spacing:6px; text-align:center;">${otp}</h1>
    <p>This OTP expires in 5 minutes.</p>
  `;

  return {
    subject: "Password Reset Request",
    html: baseLayout({
      title: "Reset Your Password",
      content,
    }),
  };
};