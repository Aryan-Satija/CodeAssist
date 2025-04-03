const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.emailID,
    pass: process.env.emailPassword, 
  }
});

exports.sendEmail = async (userEmail, userName) => {
  const mailOptions = {
    from: process.env.emailID,
    to: userEmail,
    subject: "Thank You for Registering!",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
        <h1 style="color: #4A90E2;">Welcome to CodeAssist, ${userName}! 🚀</h1>
        <p>Hello there, Future DSA Pro! 👋</p>
        <p>
          Welcome to <strong>CodeAssist</strong>, the <strong>adaptive learning platform</strong> designed to help you
          <strong>master Data Structures and Algorithms</strong> with personalized learning paths.
        </p>
        <p>Here's what you can expect:</p>
        <ul>
          <li><strong>Tailored Learning Paths:</strong> Progress at your own pace with content adapted to your strengths and weaknesses.</li>
          <li><strong>Comprehensive DSA Resources:</strong> From arrays to graphs, master it all through structured modules.</li>
          <li><strong>Smart Practice Recommendations:</strong> Get curated problem sets designed to improve your weakest areas.</li>
        </ul>
        <p>We’re excited to help you level up your DSA skills and ace your interviews! 💪</p>
        <p>Happy Learning!</p>
        <p><strong>— The CodeAssist Team 💙</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Thank you email sent successfully!");
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};