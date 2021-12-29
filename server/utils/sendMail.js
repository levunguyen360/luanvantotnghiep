const nodemailer = require('nodemailer');

const sendMail = async options => {
    const mymail = {
        service: 'gmail',
        auth:{
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    }
    const transporter = nodemailer.createTransport(mymail);
    const message = {
          from: `${process.env.SMTP_FROM_NAME}`,
          to: options.email,
          subject: options.subject,
          text: options.message
    }
    await transporter.sendMail(message)
}
module.exports = sendMail;