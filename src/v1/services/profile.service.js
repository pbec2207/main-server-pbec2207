const userModel = require('../models/users.model')
const _ = require('lodash')
const Message = require('../lang/en')
const createError = require('http-errors')
const {errorResponse} = require('../utils')
var that = module.exports = {
  getUserInfoById: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const info = await userModel.findOne({
          _id: userId
        })
        .populate({
          path: 'seller',
          select:"-_id -isDisabled -specs -userId"
        })
        .select('-_id -local.password -local.verified -status -specs')
        .lean()
        if(_.isEmpty(info)){
          return reject(errorResponse(404, createError.NotFound().message))
        }
        if(info.role === 'user'){
          return resolve({
            data: info
          })
        }
        if(info.role === 'seller'){
          return resolve({
            data: info
          })
        }
      } catch (error) {
        console.log(error)
        return reject(errorResponse(500, createError.InternalServerError().message))
      }
    })
  },
  changePassword: (userId, oldPassword, newPassword) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await userModel.findOne({
          _id: userId
        })
        if(user.role === 'admin') return reject(errorResponse(410, Message.admin_not_change_password_mobile))
        if(_.isEmpty(user)){
          return reject(errorResponse(404, createError.NotFound().message))
        }
        if(!user.local.email) return reject(401, Message.local_change_password)
        const checkPass = await user.isCheckPassword(oldPassword)
        if(!checkPass){
          return reject(errorResponse(403, Message.old_password_wrong))
        }
        const hashPassword =await user.hashPassword(newPassword)
        const updated = await userModel.updateOne({_id: userId},{
          $set:{
            "local.password":hashPassword
          }
        },{
          new: true
        })
        if(_.isEmpty(updated)) return reject(errorResponse(500, createError.InternalServerError().message))
        return resolve({
          data:{
            message: Message.update_password_success
          }
        })
      } catch (error) {
        console.log(error)
        return reject(errorResponse(500, createError.InternalServerError().message))
      }
    })
  },
  updateProfile: (userId,profile) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await userModel.findOneAndUpdate({
          _id: userId
        },{
          $set:{
            "contact.address": profile.address,
            "contact.phone":profile.phone,
            "info.firstName":profile.firstName,
            "info.lastName":profile.lastName,
            "info.nickName":profile.nickName,
            "info.gender":profile.gender,
            "info.birthDay":profile.birthDay,
            "info.language":profile.language,
            "info.avatar":profile.avatar
          }
        }, {
          new: true
        }).lean()
        console.log(user)
        if(_.isEmpty(user)){
          return reject(errorResponse(404, createError.NotFound().message))
        }
        return resolve({
          data:{
            message: Message.update_profile_success
          }
        })
      } catch (error) {
        console.log(error)
        return reject(errorResponse(500, createError.InternalServerError().message))
      }
    })
  }
}