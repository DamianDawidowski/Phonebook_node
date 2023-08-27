const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SGMAIL_KEY);

const msg = {
  to: 'test@example.com',
  from: process.env.OWN_EMAIL,
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent');
  })
  .catch(error => {
    console.error(error);
  });