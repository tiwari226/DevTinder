const nodemailer = require("nodemailer");

const sendEmail = async (email, resetUrl) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: "DevTinder Support <no-reply@devtinder.com>",
    to: email,
    subject: "Reset Your DevTinder Password",
    html: `
      <h3>Password Reset</h3>
      <p>Click below link to reset your password</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Link expires in 15 minutes</p>
    `
  });
};

module.exports = sendEmail;
