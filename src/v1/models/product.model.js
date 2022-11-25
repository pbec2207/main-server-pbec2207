const { Schema, model } = require('mongoose')


const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sellerId:{
    type: Schema.Types.ObjectId,
    ref:'users',
    require:true
  },
  category:{
    type: Schema.Types.ObjectId,
    ref: 'categories',
    require:true
  },
  quantity:{
    type:Number,
    default:0
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  originPrice: {
    type: Number,
    required: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  updatePrice:{
    type: Number
  },
  description: {
      type: String,
      default:''
  },
  summary:{
    type: String,
    default:'hello'
  },
  type:{type: String, default:'book'},
  productPictures: [
    {
      fileId:{type: String},
      fileLink:{type: String}
    }
  ],
  city:{type: String, default: "hcm"},
  release_date: Date,
  history:[
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      price: {type: Number},
      createdAt: {type: Date, default: Date.now()},
      updatedAt:{type: Date, default: Date.now()}
    }
  ],
  specs:{
    type: Array,
    default: []
  }
}, {
  collection: 'products',
  timestamps: true
})

productSchema.index({"specs.k":1,"specs.v":1})

module.exports = model('products', productSchema)