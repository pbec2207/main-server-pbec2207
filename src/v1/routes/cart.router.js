const cartController = require('../controllers/cart.controller')
const { 
  isAuthMobile
} = require('../middlewares/jwt.middleware')

module.exports = cartRouter= (router) => {
  router.post('/cart/add-to-cart',isAuthMobile,cartController.addToCart)
  router.get('/cart/get-cart-items',isAuthMobile, cartController.getCartItems)
  router.post('/cart/remove-item',isAuthMobile,  cartController.removeItem)
  router.post('/cart/add-multiple-items',isAuthMobile, cartController.addMultipleItem)
}
