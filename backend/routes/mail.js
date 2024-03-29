const nodemailer = require('nodemailer');
require('dotenv').config();
const sendEmail = async options => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASSWORD
    },
  });
  const mailOptions = {
    from: {
        name: "Babish",
        address: 'babish9887@gmail.com'
    },
    to:  [`${options.email}`],
    subject: options.subject,
    text: options.message
  };

   transporter.sendMail(mailOptions, function(err) {
    if (err) console.log("Some Error",err.message);
    else console.log('email sent successfully');
  });
};

module.exports = sendEmail;
