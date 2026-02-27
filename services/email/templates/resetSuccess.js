import { baseLayout } from "./layout.js";

export const resetSuccessTemplate = () => {
  const content = `
    <p>Your password has been successfully updated.</p>
    <p>If you did not perform this action, contact support immediately.</p>
  `;

  return {
    subject: "Password Updated Successfully",
    html: baseLayout({
      title: "Password Changed",
      content,
    }),
  };
};
