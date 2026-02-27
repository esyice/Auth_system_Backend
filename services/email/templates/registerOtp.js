import { baseLayout } from "./layout.js";

export const registerOtpTemplate = (otp) => {
  const content = `
    <p>Use the OTP below to complete your registration:</p>
    <h1 style="letter-spacing:6px; text-align:center;">${otp}</h1>
    <p>This OTP expires in 5 minutes.</p>
  `;

  return {
    subject: "Complete Your Registration",
    html: baseLayout({
      title: "Verify Your Email",
      content,
    }),
  };
};