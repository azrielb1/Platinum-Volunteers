var nodemailer = require('nodemailer');

var lib = {}

lib.sendEmail = async function(to, subject, body) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'platinumvolunteers@gmail.com',
      pass: 'PlatinumSquad123'
    }
  });
  
  var mailOptions = {
    from: 'platinumvolunteers@gmail.com',
    to: to,
    subject: subject,
    text: body
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}


module.exports = lib