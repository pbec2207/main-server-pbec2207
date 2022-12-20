const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
  contact:{
    address: {type: String, min:3, max:50},
    phone:{type:String,default:null, min:10, max:11}
  },
  local: {
    email:{
      type: String, 
      unique: true,
      trim:true,
      lowercase: true,
      index:true
    },
    verified: {type: Boolean, default: false},
    password:{type: String},
  },
  google:{
    uid:{type: String},
    name:{type:String},
    email:{type: String, trim:true},
    picture:{type:String}
  },
  info:{
    userName:{type: String, min: 2, max: 50},
    nickName:{type:String, min:2, max:50, default:''},
    gender:{type:String, default: 'male'},
    birthDay:{type:String, min:6, max:8},
    language:{type:String, enum:['en', 'vi'], default:'en'},
    avatar:{type:String}
  },
  status: {
    type: String, 
    enum: ['normal','blocked'], 
    default: "normal"
  },
  role:{
    type: String, 
    enum:["user","admin","shipper"], 
    default: "user"
  },
  meta: {
    totalBuy:{
      type: Number, 
      default: 0
    },
    totalCancel: {
      type: Number, 
      default: 0
    },
  },
  specs:{
    type: Array,  
    default: []
  }
},{
  collection: 'users',
  timestamps:true
})

userSchema.pre('save', async function(next){
  try {
    if(this.local.password){
      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(this.local.password, salt)
      this.local.password = hashPassword
    }
    next()
  } catch (error) {
    next(error)
  }
})

userSchema.methods.isCheckPassword = async function(password){
  try {
    return await bcrypt.compare(password, this.local.password)
  } catch (error) {
    console.log(error)
  }
}

module.exports = mongoose.model('users', userSchema)