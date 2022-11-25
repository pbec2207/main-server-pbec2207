const mongoose = require('mongoose')
const { Schema, model } = require('mongoose')

const inventorySchema = new Schema({
  productId: {
    type: mongoose.SchemaTypes.ObjectId, 
    require:true, 
    ref:"products"
  },
  quantity: {type: number, require: true},
  reservations: [
    {
      user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
      }
    }
  ]
}, {
  collection: 'inventories',
  timestamps: true
})

module.exports = model('inventories', inventorySchema)