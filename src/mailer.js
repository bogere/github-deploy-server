const nodemailer = require('nodemailer');
const { user, pass } = require('./configs/config');
const listofEmails = require('./configs/email-list');

const transporter = nodemailer.createTransport(`smtps://${user}%40gmail.com:${pass}@smtp.gmail.com`);

const mailOptions = (emails, message, domain) => ({
  from: '"datahub deploy server" <epicallan.al@gmail.com>', // sender address
  to: emails.join(','), // list of receivers
  subject: `Deployment Status for ${domain}`, // Subject line
  text: message, // plaintext body
  html: `<p>${message}</p>` // html body
});

function emailer(msg, domain, callback) {
  // we dont send emails while in development environment
  if (process.env.NODE_ENV === 'development') return false;
  const options = mailOptions(listofEmails, msg, domain);
  // send mail with defined transport object
  return transporter.sendMail(options, (error, info) => {
    if (error) return console.log(error);
    if (callback) return callback(error, info);
    console.log(`Message sent: ${info.response}`);
    return process.exit(); // exiting child if it hasnt exited already
  });
}
module.exports = emailer;
