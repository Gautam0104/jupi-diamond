  import nodemailer from "nodemailer";

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // eslint-disable-next-line no-undef
      user: process.env.SENDING_EMAIL,
      // eslint-disable-next-line no-undef
      pass: process.env.SENDING_PASSWORD,
    },
  });

  export default transporter;
