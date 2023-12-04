const nodemailer = require("nodemailer");
const { MAILTRAP_USER, MAILTRAP_PASSWORD } = process.env;

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: MAILTRAP_USER,
    pass: MAILTRAP_PASSWORD,
  },
});

const sendMail = (message) => {
  message.from = "vanyonix@gmail.com";
  return transport.sendMail(message);
};

module.exports = sendMail;
