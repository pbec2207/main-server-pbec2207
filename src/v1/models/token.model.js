const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const tokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    generatedToken: {
      type: String,
      required: true,
      trim: true,
    },
    expireAt: {
      type: Date,
      default: Date.now,
      expires: '1h'  // set expire time is 24h
    }
  },
  {
    collection: 'tokens', 
    timestamps: true
  }
);

tokenSchema.pre('save', async function(next){
  try {
    if(this.generatedToken){
      const salt = await bcrypt.genSalt(10)
      const hashToken = await bcrypt.hash(this.generatedToken, salt)
      this.generatedToken = hashToken
    }
    next()
  } catch (error) {
    next(error)
  }
})

tokenSchema.methods.isCheckToken = async function(token){
  try {
    return await bcrypt.compare(token, this.generatedToken)
  } catch (error) {
    console.log(error)
  }
}


module.exports = mongoose.model("tokens", tokenSchema);