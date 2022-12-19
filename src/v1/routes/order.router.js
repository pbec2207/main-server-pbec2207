const orderController = require('../controllers/order.controller')
const { isAuthMobile, isAuthShipper } = require('../middlewares/jwt.middleware')
const validation = require('../middlewares/validation.middleware')
const {
  addDeliveryInfoSchema,
  updateDeliveryInfoSchema
} = require('../validations/order.validation')
module.exports = orderRouter= (router) => {
  // delivery info
  router.post('/delivery/add', isAuthMobile,validation(addDeliveryInfoSchema), orderController.addDeliveryInfo)
  router.get('/delivery/get', isAuthMobile, orderController.getUserDeliveryInfo)
  router.post('/delivery/delete', isAuthMobile, orderController.deleteDeliveryInfo)
  router.put('/delivery/update', isAuthMobile,validation(updateDeliveryInfoSchema), orderController.updateDeliveryInfo)
  router.put('/delivery/set-default', isAuthMobile, orderController.setDefaultDeliveryInfo)
  // user
  router.post('/order/add', isAuthMobile, orderController.addOrder)
  router.post('/order/get-detail', isAuthMobile, orderController.getDetailOrder)
  router.get('/order/all', isAuthMobile, orderController.getOrderList)
  router.get('/order/all-ordered', isAuthMobile, orderController.getAllOrdered)
  router.post('/order/cancel-order-item', isAuthMobile, orderController.cancelOrderItem)
  router.post('/order/cancel-order', isAuthMobile, orderController.cancelOrder)
  router.get('/order/get-all-orders-cancel', isAuthMobile, orderController.getAllOrdersCancelUser)
  router.get('/order/all-orders-packed', isAuthMobile, orderController.getAllOrdersPackedUser)
  router.get('/order/all-orders-shipping', isAuthMobile, orderController.getAllOrdersShippingUser)
  router.get('/order/all-orders-completed', isAuthMobile, orderController.getAllOrdersCompletedUser)
  //seller
  router.get('/seller/orders-processing',isAuthMobile, orderController.getOrdersNotDoneOfSeller)
  router.put('/seller/status-order',isAuthMobile, orderController.updateStatusOrderBySeller)
  //shipper
  router.put('/shipper/status-order',isAuthShipper, orderController.updateStatusOrderByShipper)
  router.get('/shipper/all-orders-shipping', isAuthShipper, orderController.getOrdersShipping)
}
