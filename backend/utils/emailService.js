const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your email service (e.g., Gmail, Outlook, etc.)
  host: "smtp.gmail.com",
  port: 465, // or 587 for TLS
  secure: false,
  auth: {
    user: "the5sithelpdesk@gmail.com", // Your email address
    pass: "5sproject@loginware", // Your email password or app password
  },
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error with email transporter:", error);
  } else {
    console.log("Email transporter is ready");
  }
});

module.exports = transporter;
