const Message = require('../lang/en')
const userModel = require('../models/users.model')
const otpModel = require('../models/otp.model')
const tokenModel = require('../models/token.model')
const {
  handlerRequest,
  errorResponse,
  generateOtp
} = require('../utils')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const redis = require('../databases/init.redis')
const createError = require('http-errors')
const jwtService = require('./jwt.service')
const qs = require('qs')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid');
const otpGenerator = require('otp-generators')


var that = module.exports = {
  userRegisterWeb: (user) => {
    return new Promise(async (resolve, reject)=> {
      const checkExisted = await userModel.findOne({
        $or:[
          {$and:[
            {"local.email": user.email},
            {"google.email":user.email}
          ]},
          {"local.email": user.email}
        ]
      }) 
      // when account is existed in database
      if(!_.isEmpty(checkExisted)) {
        return reject(errorResponse(400, Message.email_existed))
      }
      //when google is existed
      const verifyToken = uuidv4()
      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(user.password, salt)
      let err, data
        [err, data] = await handlerRequest(userModel.findOneAndUpdate(
        {"google.email":user.email},
        {$set:{
            "local.email":user.email,
            "local.password":hashPassword,
            "info.userName":user.userName
          }
        },{
          new: true
        }
      ))
      if(err) {
        return reject(errorResponse(500, createError[500]))
      }

      if(_.isEmpty(data)){
        
        [err, data] = await handlerRequest(
          new userModel({
            local:{
              email:user.email,
              password:user.password
            },
            info:{
              userName: user.userName,
              gender:user.gender
            }
          }).save()  
        )
        if(err){
          console.log(err)
          return reject(errorResponse(500, createError.InternalServerError().message))
        }
        await new tokenModel({
          user: data._id,
          generatedToken: verifyToken
        }).save()
        redis.publish('send_mail',JSON.stringify({
          email: data.local.email,
          _id:data._id,
          verifyToken:verifyToken,
          name: data.info.userName
        }))
        return resolve({
          data:{
            message: Message.register_success
          }
        })
      }
      await new tokenModel({
        user: data._id,
        generatedToken: verifyToken
      }).save()

      redis.publish('send_mail',JSON.stringify({
        email: user.email,
        _id:data._id,
        verifyToken:verifyToken,
        name: user.name
      }))

      return resolve({
        data:{
          message: Message.register_success
        }
      })
      
    })
  },
  userLogin: (email, password) => {
    return new Promise(async (resolve, reject)=> {
      try {
        const account = await userModel
        .findOne(
          {
          "local.email":email
          })
        if(_.isEmpty(account)){
          return reject(errorResponse(401, Message.login_wrong))
        }
        const checkPassword = await account.isCheckPassword(password)
        if(!checkPassword){
          return reject(errorResponse(401, Message.login_wrong))
        }
        
        if(!account.local.verified){

          return reject({
            status: 406,
            "errors":{
              userId:account._id,
              message: Message.account_inactive
            }
          })
        }

        if(account.status === "blocked"){
          return reject(errorResponse(401, Message.account_locked))
        }

        if(account.role === "user"){
          const payload = {
            _id: account._id,
            nickName: account.info.nickName,
            userName:account.info.userName,
            profilePicture: account.info.avatar,
            role:account.role,
            meta:account.meta,
            special:account.specs,
            typeLogin:"local"
          }
          try {
            const access_token = await jwtService.signAccessToken(payload)
            const refresh_token = await jwtService.signRefreshToken(payload)
            return resolve({
              data: payload,
              access_token,
              refresh_token
            })  
          } catch (error) {
            console.log(error)
            return reject(errorResponse(401, createError.InternalServerError().message))
          }
        }
        if(account.role === 'admin'){
          const payload = {
            _id: account._id,
            email:account.local.email,
            nickName: account.info.nickName,
            userName:account.info.userName,
            profilePicture: account.info.avatar,
            role: account.role,
            meta:account.meta,
            special:account.specs,
            typeLogin:"local"
          }
          const access_token = await jwtService.signAccessToken(payload)
          const refresh_token = await jwtService.signRefreshToken(payload)
          return resolve({
            data: payload,
            access_token,
            refresh_token
          })
        }
      } catch (error) {
        console.log(error)
        return reject(errorResponse(500, createError.InternalServerError().message))
      }
    })
  }
  ,
  activeAccount: (userId, token) => {
    return new Promise(async (resolve, reject) => {
        try {
          const existed = await tokenModel.findOne({user: userId})
          if(_.isEmpty(existed)){
            return reject(errorResponse(401, Message.token_expired))  
          }
          const valid = await existed.isCheckToken(token)
          if(!valid){
            return reject(errorResponse(402, Message.token_invalid))
          }
          await userModel.findOneAndUpdate(
              { $and:[
                {_id: existed.user},
                {"local.verified": {$ne: true}}
              ] },
              {"local.verified": true},
              {new: true}
            )
          existed.remove()
          return resolve({
            data:{
              message:Message.active_success
            }
          })
        } catch (error) {
          console.log(error)
          return reject(errorResponse(500, Message.server_wrong))
        }
    })
  },
  getGoogleOAuthTokens: (code) => {
    return new Promise(async (resolve, reject) => {
      const url = process.env.GOOGLE_OAUTH_TOKEN
      const values = {
        code,
        client_id:process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri:process.env.GOOGLE_OAUTH_REDIRECT_URL,
        grant_type:'authorization_code'
      }
      try {
        const {data} = await axios.post(url, qs.stringify(values),
        {
          headers:{
            'Content-Type':'application/x-www-form-urlencoded'
          }
        })
        return resolve(data)
      } catch (error) {
        console.log(error.response.data.error)
        return reject(errorResponse(400, error.response.data.error))
      }
    })
  },
  getGoogleUser: (id_token, access_token) => {
    return new Promise(async (resolve, reject) => {
      try {
        const {data} = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers:{
            Authorization: `Bearer ${id_token}`
          }
        })
        return resolve(data)
      } catch (error) {
        console.log(error.response.data.error)
        return reject(errorResponse(400, error.response.data.error))
      }
    })
  },
  googleLogin: (googleUser) => {
    return new Promise(async (resolve, reject) => {
      try {
        if(!googleUser.verified_email){
          return reject({
            status: 203,
            "errors":{
              message:Message.account_inactive
            }
          })
        }
        const accountExisted = await userModel.findOne({
          $or:[
            {"google.uid":googleUser.id},
            {"local.email":googleUser.email}
          ]
        })

        //account not exists
        if(_.isEmpty(accountExisted)){
          const createUser = new userModel({
            google:{
              uid:googleUser.id,
              email:googleUser.email,
              picture:googleUser.picture,
              name:googleUser.name
            }
          })
          const created = await createUser.save()
          const payload = {
            _id: created._id,
            email:created.google.email,
            userName:created.google.name,
            profilePicture:created.google.picture,
            role:created.role,
            meta:created.meta,
            special:created.special,
            typeLogin:"google"
          }
          try {
            const access_token = await jwtService.signAccessToken(payload)
            const refresh_token = await jwtService.signRefreshToken(payload)
            return resolve({
              data: payload,
              access_token,
              refresh_token
            })  
          } catch (error) {
            console.log(error)
            return reject(errorResponse(400, createError.InternalServerError().message))
          }
        }
        
        //account is existed
        if(accountExisted.status === "blocked"){
          return reject(errorResponse(401, Message.account_locked))
        }
        const updatedAccount = await userModel.findOneAndUpdate({
          $or:[
            {"google.uid":googleUser.id},
            {"local.email":googleUser.email}
          ]
        },{
          $set:{
            "google.uid":googleUser.id,
            "google.email":googleUser.email,
            "google.picture":googleUser.picture,
            "google.name":googleUser.name
          }
        },
        {
          upsert: true,
          new: true,
        })
          
        if(updatedAccount.role === "user"){
          const payload = {
            _id: updatedAccount._id,
            email:googleUser.email,
            name: googleUser.name,
            profilePicture: googleUser.picture,
            role: updatedAccount.role,
            meta:updatedAccount.meta,
            special:updatedAccount.special,
            typeLogin:"google"
          }
          try {
            const access_token = await jwtService.signAccessToken(payload)
            const refresh_token = await jwtService.signRefreshToken(payload)
            return resolve({
              data: payload,
              access_token,
              refresh_token
            })  
          } catch (error) {
            console.log(error)
            return reject(errorResponse(400, createError.InternalServerError().message))
          } 
        }
        return reject(errorResponse(403, Message.account_invalid))
      } catch (error) {
        console.log(error)
        return reject(errorResponse(400, createError.InternalServerError().message))
      }
    })
  },
  sendEmailResetPassword: (email) => {
    return new Promise(async (resolve, reject) => {
      try {
        const getUser = await userModel.findOne({
          "local.email":email
        }).lean()
        if(_.isEmpty(getUser)){
          return reject({
            status: 400,
            "errors":{
              message:Message.email_not_exists
            }
          })
        }
        if(!getUser.local.verified) {
          return reject(errorResponse(400, Message.account_inactive))
        }
        const otp = generateOtp(6);
        (await otpModel.find({user: getUser._id})).map((value) => value.remove())
        await new otpModel({
          user: getUser._id,
          generatedOtp: otp
        }).save()
        redis.publish('send_otp_reset_password',JSON.stringify({
          email: email,
          otp:otp,
          name: getUser.info.firstName + getUser.info.lastName
        }))
        return resolve({
          data:{
            message:Message.send_mail_reset_success
          },
          userId: getUser._id
        })
      } catch (error) {
        console.log(error)
        return reject(errorResponse(500, createError.InternalServerError().message))
      }
    })
  },
  OTPCode: (userId,otp) => {
    return new Promise(async (resolve, reject) => {
      try {
        const existed = await otpModel.findOne({
          user: userId
        })
        if(_.isEmpty(existed)){
          return reject(errorResponse(400, Message.otp_expired))
        }
        const valid = await existed.isCheckOtp(otp)
        if(!valid) return reject(errorResponse(400, Message.otp_invalid))
        const verifyToken = uuidv4()
        const createToken = await new tokenModel({
          user: userId,
          generatedToken: verifyToken
        }).save()
        existed.remove()
        return resolve({
          data:{
            token:createToken.generatedToken
          },
          userId: userId
        })
      } catch (error) {
        console.log(error)
        return reject(errorResponse(500, createError.InternalServerError().message))   
      }
    })
  },
  resetPassword: (userId,token, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const existed = await tokenModel.findOne({
          $and: [
            {user: userId},
            {generatedToken: token}
          ]
        })
        if(_.isEmpty(existed)){
          return reject(errorResponse(400, Message.token_invalid))
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        await userModel.updateOne({
          _id: userId
        },{
          $set:{
            "local.password":hashPassword
          }
        })
        existed.remove()
        return resolve({
          data:{
            message:Message.reset_password_success
          }
        })
      } catch (error) {
        console.log(error)
        return reject(errorResponse(500, createError.InternalServerError().message))
      }
    })
  },
}