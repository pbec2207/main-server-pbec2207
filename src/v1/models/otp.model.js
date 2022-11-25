const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const otpSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    generatedOtp: {
      type: String,
      required: true,
      trim: true,
    },
    expireAt: {
      type: Date,
      default: Date.now,
      expires: '5m'  // set expire time is 5 minutes
    }
  },
  { 
    collection:'otps'
  }
);

otpSchema.pre('save', async function(next){
  try {
    if(this.generatedOtp){
      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(this.generatedOtp, salt)
      this.generatedOtp = hashPassword
    }
    next()
  } catch (error) {
    next(error)
  }
})

otpSchema.methods.isCheckOtp = async function(otp){
  try {
    return await bcrypt.compare(otp.toString(), this.generatedOtp)
  } catch (error) {
    console.log(error)
  }
}

module.exports = mongoose.model("otps", otpSchema);