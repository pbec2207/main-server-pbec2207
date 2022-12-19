const cartModel = require('../models/cart.model')
const productModel = require('../models/product.model')
const { errorResponse } = require('../utils')
const createError = require('http-errors')
const Message = require('../lang/en')
const _ = require('lodash')
const mongoose = require('mongoose')
const { totalPriceProduct, convertSpecsInProduct } = require('../utils')
var that = module.exports = {
  addToCart: (userId,cartItem) => {
    return new Promise(async (resolve, reject) => {
      try {
        const productExists = await productModel.findOne({
          _id: cartItem.product
        }).lean()
       
        if(_.isEmpty(productExists)) return reject(errorResponse(404, Message.product_not_found))
        const cartExists = cartModel.findOne({
          user: userId
        }).lean()

        const productAlready = cartModel.exists({
          $and:[
            {user: userId},
            {cartItems: {$elemMatch: {product: cartItem.product}}}
          ]
        })

        const [cart , productAdded] = await Promise.all([cartExists, productAlready])


        if (!_.isEmpty(cart)) {
          
          if (productAdded) {
            condition = { $and:[
              {user: userId},
              {cartItems: {$elemMatch:{product: cartItem.product}}}
            ]}
            update = {
                $set: {
                    "cartItems.$.quantity": cartItem.quantity,
                    "cartItems.$.wishlist": cartItem.wishlist
                }
            }
          } else {
            condition = { user: userId }
            update = {
                $push: {
                    cartItems: cartItem
                }
            }
          }
            cartModel.findOneAndUpdate(condition, update,
            { new: true, upsert: true, setDefaultsOnInsert: false })
            .exec((error, cart) => {
              if (error) return reject(errorResponse(500, createError.InternalServerError().message))
              if (!_.isEmpty(cart)) {
                  return resolve({
                    data: {
                      message: Message.add_cart_success
                    }
                  })
              }
            })
        } else {
          const cart = new cartModel({
            user: userId,
            cartItems: [cartItem]
          })
          cart.save((error, cart) => {
            if (error) return reject(errorResponse(500, createError.InternalServerError().message))
            if (cart) {
              return resolve({
                data: {
                  message:Message.add_cart_success
                }
              })
            }
          })
        }
      } catch (error) {
        console.log(error)
        return reject(errorResponse(500, createError.InternalServerError().message))
      }
    })
  },
  getCartItems: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const cart = await cartModel.findOne({
          user: userId
        })
        .populate({
          path: 'cartItems.product',
          populate:[
            {
              path: "sellerId",
              select:"info"
            },
            {
              path: "category",
              select:"name -_id"
            }
          ],
          select:"-description -summary"
        })   
        .lean()
        if(_.isEmpty(cart)){
          return resolve({
            data: []
          })
        }
        return resolve({
          data: {
            _id: cart._id,
            user: cart.user,
            cartItems:cart.cartItems.map((item) => {
              if(!item.product){
                return {
                  message: "product not exists"
                }
              }
              return {           
                ...item,
                product: {
                  ...item.product,
                  seller:item.product.sellerId,
                  sellerId: item.product.sellerId._id,
                  specs: convertSpecsInProduct(item.product), 
                  productPictures: item.product.productPictures[0]
                },
                totalPrice: totalPriceProduct(item.product.price, item.quantity, item.product.discountPercent)
              }
            })
          }
        })
      } catch (error) {
        console.log(error)
        return reject(errorResponse(500, createError.InternalServerError().message))
      }
    })
  },
  removeCartItem: (userId, cartItem) => {
    return new Promise(async (resolve, reject) => {
      try {
        const cart = await cartModel.findOneAndUpdate({
          user: userId
        },{
          $pull: {
              cartItems: {
                  product: cartItem.product
              }
          }
        
        }, {new: true, upsert: true})
        .lean()
        if(_.isEmpty(cart)){
          return reject(errorResponse(404, createError.NotFound().message))
        }
        return resolve({
          data:{
            message:Message.delete_success
          }
        })
      } catch (error) {
        console.log(error)
        return reject(errorResponse(500, createError.InternalServerError().message))        
      }
    })
  },
  addMultipleItemToCart: (userId, cartItems) => {
    return new Promise((resolve, reject) => {
      cartModel.findOne({user: userId}).exec(async (error, cart) => {
        console.log(error)
        if(error) return reject(errorResponse(500, createError.InternalServerError().message))
        if(_.isEmpty(cart)) return reject(errorResponse(404, createError.NotFound().message))

        try {
          await Promise.all(cartItems.map((item) => {
            return that.addToCart(userId, item)
          }))
          return resolve({
            data:{
              message: Message.update_success
            }
          })    
        } catch (error) {
          console.log(error)     
        }
      })
    })
  }
}