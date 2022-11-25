const express = require('express');
const router = express.Router();
const authRouter = require('./auth.router')
const uploadRouter = require('./upload.router')
const productRouter = require('./product.router')
router.get('/checkstatus',async (req, res, next) => {
    try {
       
    } catch (error) {
        console.log(error)
    }
    res.status(200).json({
        status: 'success',
        message: 'api ok'
    })
})

authRouter(router)
uploadRouter(router)
productRouter(router)

module.exports = router;