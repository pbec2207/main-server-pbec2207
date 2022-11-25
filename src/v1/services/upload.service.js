const _ = require('lodash')
const Message = require('../lang/en')
const {errorResponse} = require('../utils')
const createError = require('http-errors')
const userModel = require('../models/users.model')
const redis = require('../databases/init.redis')
var that = module.exports = {
  deleteFileList: (fileList, token) => {
    return new Promise(async (resolve, reject) => {
      try {
        const isExisted = await userModel.findOne({
          "verifyCodeSeller":token
        })
        if(_.isEmpty(isExisted)){
          return reject(errorResponse(400,Message.token_register_not_match))
        }
        redis.publish('delete_file_list',JSON.stringify({
          fileList
        }))
        resolve({
          data:{
            message:Message.delete_file_list_success
          }
        })
      } catch (error) {
        console.log(error)
        return reject(errorResponse(500, createError.InternalServerError()))
      }
    })
  }
}