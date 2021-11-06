const Mailgen = require("mailgen");

class EmailService {
  constructor(env, sender) {
    this.sender = sender;
    switch (env) {
      case "development":
        this.link = process.env.DEV_LINK;
        break;
      case "production":
        this.link = "link for production";
        break;

      default:
        this.link = process.env.DEV_LINK;
        break;
    }
  }

  createTemplateEmail(name, verifyToken) {
    const mailGenerator = new Mailgen({
      theme: "salted",
      product: {
        name: "Contact Book",
        link: this.link,
      },
    });

    const email = {
      body: {
        name: "Guest",
        intro:
          "Welcome to Contact Book! We are very excited to have you on board",
        action: {
          instructions:
            "To get started with Contact Book, please click here:",
          button: {
            color: "#22BC66",
            text: "Confirm your account",
            link: `${this.link}/api/users/verify/${verifyToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
    return mailGenerator.generate(email);
  }

  async sendVerifyEmail(email, name, verifyToken) {
    const emailHTML = this.createTemplateEmail(name, verifyToken);
    const msg = {
      to: email,
      subject: "Verify your email",
      html: emailHTML,
    };
    try {
      const result = await this.sender.send(msg);
      console.log(result);
      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }
}

module.exports = EmailService;