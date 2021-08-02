// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});
const notify = function (toEmail, subject, message){
// Create sendEmail params 
var params = {
  Destination: { /* required */
    // CcAddresses: [
    //   'EMAIL_ADDRESS',
    //   /* more items */
    // ],
    ToAddresses: [
      toEmail,
      /* more items */
    ]
  },
  Message: { /* required */
    Body: { /* required */
      Text: {
       Charset: "UTF-8",
       Data: message,
      }
     },
     Subject: {
      Charset: 'UTF-8',
      Data: subject,
     }
    },
  Source: 'platinumvolunteers@gmail.com', /* required */
  ReplyToAddresses: [
     'platinumvolunteers@gmail.com',
    /* more items */
  ],
};

// Create the promise and SES service object
var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

// Handle promise's fulfilled/rejected states
sendPromise.then(
  function(data) {
    console.log(data.MessageId);
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });
}
export default notify