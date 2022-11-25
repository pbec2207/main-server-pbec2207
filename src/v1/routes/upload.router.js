const uploadController = require('../controllers/upload.controller')
const {verifyAccessToken} = require('../middlewares/jwt.middleware')
module.exports = uploadRouter= (router) => {
  router.post('/auth/delete-files', uploadController.deleteListFile)
  router.post('/upload/delete-file', verifyAccessToken, uploadController.deleteFilesBySeller)
}