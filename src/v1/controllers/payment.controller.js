const paypal = require('../middlewares/paypal.middleware')
const orderModel = require('../models/order.model')
const paymentHistoryModel = require('../models/paymentHistory.model')
const {
  errorResponse
} = require('../utils')
const Message = require('../lang/en')
const createError = require('http-errors')

var that = module.exports = {
  paypalPaymentSuccess: async (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    
    const payment = await paymentHistoryModel.findOne({
      payId:paymentId
    }).lean()

    if(!payment) return res.status(404).json(errorResponse(404, Message.payment_not_exists))

    const execute_payment_json = {
      "payer_id": payerId
    };

    // Obtains the transaction details from paypal
    paypal.payment.execute(paymentId, execute_payment_json,async function (error, paymentDetails) {
        //When error occurs when due to non-existent transaction, throw an error else log the transaction details in the console then send a Success string reposponse to the user.
      if (error) {
          return res.status(403).json({
            status:403,
            "errors":{
              message: error
            }
          })
      } else {
        const amount =  paymentDetails.transactions.at(0).amount
      

        const orderPayload = {
          user: payment.user,
          address: payment.address,
          totalAmount: amount.total,
          items: payment.items,
          paymentStatus: "completed",
          paymentType:"paypal",
          shippingCost: amount.details.shipping,
          subtotal: amount.details.subtotal,
          orderStatus: [
            {
              type: "ordered",
              date: Date.now(),
              isCompleted: true
            },
            {
              type: "packed",
              date: Date.now(),
              isCompleted: false
            }
          ]
        }
        try {
          const order =await new orderModel(orderPayload).save()
          await paymentHistoryModel.updateOne({
            payId:paymentId
          },{
            $set:{
              order: order._id,
              paymentStatus:"completed",
              paymentDetails:paymentDetails
            }
          })
          
          res.json({
            data:{
              paymentId: paymentId
            }
          });
        } catch (error) {
          console.log(error)
          return res.status(500).json(errorResponse(500, createError.InternalServerError().message))
        }
      }
    });
  },
  paypalPaymentCancel: async (req, res) => {
      const {token} = req.query
      try {
        await paymentHistoryModel.updateOne({
          token: token
        },{
          $set:{
            paymentStatus: "cancelled"
          }
        })

        res.json({
          data:{
            message:"This payment is cancelled"
          }
        })
      } catch (error) {
        console.log(error)
        res.status(500).json(errorResponse(500, createError.InternalServerError().message))
      }
  },
  paypalPaymentStatus: async (req, res) => {
    const {payId} = req.body 
    try {
      const payment = await paymentHistoryModel.findOne({
        $and:[
          {user: req.payload._id},
          {payId: payId}
        ]
      }).lean()
      if(!payment) return res.status(404).json(errorResponse(404, createError.NotFound().message))
      return res.json({
        data:{
          paymentStatus: payment.paymentStatus
        }
      })
    } catch (error) {
      console.log(error)
      res.status(500).json(errorResponse(500, createError.InternalServerError().message))
    }
  }
}