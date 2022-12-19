const mongoose = require('mongoose')
const { Schema, model } = require('mongoose')

const inventorySchema = new Schema({
  product: {
    type: mongoose.SchemaTypes.ObjectId, 
    require:true, 
    ref:"products"
  },
  sellerId:{
    type: mongoose.SchemaTypes.ObjectId,
    ref:"sellers",
    required: true
  },
  reservations: [
    {
      order: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"orders",
        required: true
      }
    }
  ]
}, {
  collection: 'inventories',
  timestamps: true
})

module.exports = model('inventories', inventorySchema)