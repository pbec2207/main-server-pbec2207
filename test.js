const otpGenerator = require('otp-generators')
const otp = otpGenerator.generate(6, 
  { alphabets: false, upperCase: false, specialChar: false })
console.log(otp)
