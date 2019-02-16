const accountSid = process.env.TWILIO_SSID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const {getShuttleLocation} = require('../api/colbyshuttle');
const {parseMessage} = require('./message_parser');

const send_text = (phone_number, message) => {
  client.messages
      .create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone_number
      })
      .then(message => console.log(message.sid))
      .done();
};

const receive_message = body => {
  // here is where we collect data for analysis and bug reports
  const phoneNumber = body.From;
  const message = body.Body;

  const parsedMessage = parseMessage(message);

  console.log(parsedMessage);
};

module.exports = {
  receive_message,
}