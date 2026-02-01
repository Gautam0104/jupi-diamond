import transporter from "../utils/nodeMailer.js";

export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    to,
    subject,
    html,
  });
};
