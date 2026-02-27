export const baseLayout = ({ title, content }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0;padding:0;background-color:#f4f7f9;font-family:Segoe UI,Arial,sans-serif;color:#333;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">
          
          <table width="450" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e1e8ed;">
            
            <!-- Header -->
            <tr>
              <td align="center" style="background-color:#0F172B;padding:25px;color:#ffffff;">
                <h2 style="margin:0;font-size:20px;">${title}</h2>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:40px 30px;text-align:center;">
                ${content}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px;text-align:center;font-size:12px;color:#8898aa;background-color:#f9fafb;">
                
                <p style="margin:6px 0;">
                  ⚠️ This is a system-generated email. Please do not reply.
                </p>

                <p style="margin:6px 0;">
                  If you need assistance, contact us at 
                  <a href="mailto:contact@anshvarma.in" style="color:#2563eb;text-decoration:none;">
                    contact@anshvarma.in
                  </a>
                </p>

                <p style="margin:6px 0;">
                  © ${new Date().getFullYear()} AnshVarma.in
                </p>

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};
