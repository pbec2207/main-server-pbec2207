const categoryModel = require('../models/category.model')
const otpGenerator = require('otp-generators')
const _ = require('lodash')
const { errorResponse } = require('../utils')
const createError = require('http-errors')
const Message = require('../lang/en')
const slugify = require("slugify")
const shortid = require("shortid")
var that = module.exports = {
  addCategory: (category) => {
    return new Promise(async (resolve, reject) => {
      try {
        const existed = await categoryModel.findOne({
          "name": category.name
        })
        if(!_.isEmpty(existed)){
          return reject(errorResponse(400, Message.name_existed))
        }
        await new categoryModel({
          name:category.name,
          categoryImage:category.categoryImage ? category.categoryImage : "", 
          slug: `${slugify(category.name)}-${shortid.generate()}`
        }).save()
        return resolve({
          data:{
            message:Message.add_category_success
          }
        })
      } catch (error) {
        console.log(error)
        return reject(errorResponse(500, error))
      }
    })
  },
  getAllCategories: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const categories = await categoryModel.find({}).select('name slug _id').lean()
        if(_.isEmpty(categories)){
          return reject(errorResponse(404, Message.category_empty))
        }
        return resolve({
          data:categories
        })
      } catch (error) {
        console.log(error)
        return reject(errorResponse(500, createError.InternalServerError()))
      }
    })
  }
}