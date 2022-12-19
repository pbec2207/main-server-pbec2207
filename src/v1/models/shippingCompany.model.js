const mongoose = require('mongoose')

const shippingCompanySchema = new mongoose.Schema({
    name:{
      type: String,
      require: true
    }
  }, {
    collection:"shippingCompany",
    timestamps: true
  }
)
module.exports = mongoose.model("shippingCompany", shippingCompanySchema)