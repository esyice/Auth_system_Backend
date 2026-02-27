import { baseLayout } from "./layout.js";

export const registerSuccessTemplate = () => {
  const content = `
    <p style="font-size:16px;">
      Your account has been successfully created.
    </p>

    <div style="margin:25px 0;">
      <a href="https://auth.anshvarma.in"
        style="
          background:#2563eb;
          color:#ffffff;
          padding:12px 25px;
          text-decoration:none;
          border-radius:4px;
          font-weight:600;">
        Login Now
      </a>
    </div>
  `;

  return {
    subject: "Registration Successful",
    html: baseLayout({
      title: "Welcome to Ansh Auth",
      content,
    }),
  };
};
