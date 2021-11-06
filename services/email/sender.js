const nodemailer = require("nodemailer");
require("dotenv").config();

class CreateSender {
  async send(msg) {
    const config = {
      host: process.env.HOST_EMAIL,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SEND_EMAIL,
        pass: process.env.PASSWORD,
      },
    };
    const transporter = nodemailer.createTransport(config);
    return await transporter.sendMail({
      ...msg,
      from: process.env.SEND_EMAIL,
    });
  }
}

module.exports = CreateSender;