const paymentController = require('../controllers/payment.controller')
const {isAuthMobile} = require('../middlewares/jwt.middleware')
module.exports = paymentRouter= (router) => {
  router.get('/pay/paypal-success', paymentController.paypalPaymentSuccess)
  router.get('/pay/paypal-cancel', paymentController.paypalPaymentCancel)
  router.post('/pay/check-status',isAuthMobile, paymentController.paypalPaymentStatus)
}
