const mongoose = require('mongoose')

const shippingSchema = new mongoose.Schema({
    code:{
      type: Number,
      required: true,
      unique: true
    },
    to: {
        type: Number,
        required: true
    },
    from: {
        type: Number,
        required: true
    },
    price:{
      type: Number,
      default:0,
      required:true
    },
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref:'users',
      required: true
    },
    company:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'shippingCompany',
      required:true
    }
}, {
  collection: "shipping",
  timestamps: true
}
)
module.exports = mongoose.model("shipping", shippingSchema)