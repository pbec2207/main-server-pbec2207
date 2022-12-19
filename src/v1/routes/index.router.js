const express = require('express');
const router = express.Router();
const authRouter = require('./auth.router')
const uploadRouter = require('./upload.router')
const productRouter = require('./product.router')
const cartRouter = require('./cart.router')
const profileRouter = require('./profile.router')
const orderRouter = require('./order.router')
const paymentRouter = require('./payment.router')


router.get('/checkstatus',async (req, res, next) => {
    

    res.status(200).json({
        status: 'success',
        message: 'api ok'
    })
})

authRouter(router)
uploadRouter(router)
productRouter(router)
cartRouter(router)
profileRouter(router)
orderRouter(router)
paymentRouter(router)

module.exports = router;