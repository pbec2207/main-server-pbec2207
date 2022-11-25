const _ = require('lodash')
const Message =  require('../lang/en')
const {
  deleteFileList
} = require('../services/upload.service')
const redis = require('../databases/init.redis')
var that = module.exports = {
  deleteListFile:async (req, res) => {
    const {fileList, token} = req.body
    if(_.isEmpty(fileList)){
      return res.json({
        data: {
          message:Message.file_list_empty
        }
      })
    }
    try {
      const payload = await deleteFileList(fileList, token)
      return res.json(payload)
    } catch (error) {
      return res.status(error.status).json(error)
    }    
  },
  deleteFilesBySeller:async (req, res) => {
    const {fileList} = req.body

    redis.publish('delete_file_list',JSON.stringify({
      fileList
    }))
    res.json({
      data:{
        message:"delete success"
      }
    })    
  }
}