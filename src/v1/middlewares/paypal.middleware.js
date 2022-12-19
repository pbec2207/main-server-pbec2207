const paypal = require('paypal-rest-sdk')
const dotenv = require('dotenv')
dotenv.config()

paypal.configure({
  'mode': process.env.MODE_PALPAL_SANDBOX, //sandbox or live
  'client_id': process.env.CLIENT_ID_PAYPAL_SANDBOX,
  'client_secret': process.env.CLIENT_SECRET_PAYPAL_SANDBOX
});

module.exports = paypal