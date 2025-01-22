import nodemailer from "nodemailer";

class EmailService {
  to: string;
  message: string;
  constructor(to: string, message: string) {
    this.to = to;
    this.message = message;
  }
  async sendVerificationEmail() {
    const emailConfig = {
      Service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    };
    const transporter = nodemailer.createTransport(emailConfig);
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: this.to,
      subject: "OTP for email verification",
      text: this.message,
    };
    const response = await transporter.sendMail(mailOptions);
    return response;
  }
}
export { EmailService };
