const cartService = require('../services/cart.service')
var that = module.exports = {
  addToCart: async (req, res) => {
    const {cartItem} = req.body
    try {
      const payload = await cartService.addToCart(req.payload._id, {
        product: cartItem.product,
        wishlist: cartItem.wishlist
      })
      res.json(payload)
    } catch (error) {
      console.log(error)
      res.status(error.status).json(error)
    }
  },
  getCartItems:async (req, res) => {
    try {
      const payload = await cartService.getCartItems(req.payload._id)
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },
  removeItem: async (req, res) => {
    try {
      const {cartItem} = req.body
      const payload = await cartService.removeCartItem(req.payload._id, {
        product:cartItem.product
      })
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },
  addMultipleItem: async (req, res) => {
    const {cartItems} = req.body
    try {
      const payload = await cartService.addMultipleItemToCart(req.payload._id, cartItems)      
      res.json(payload)
    } catch (error) {
      console.log(error)
    }
  }
}