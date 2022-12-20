const orderService = require('../services/order.service')
var that = module.exports = {
  addDeliveryInfo: async (req, res) => {
    const {address} = req.body
    try {
      const payload = await orderService.addDeliveryInfo(req.payload._id, {
        name: address.name,
        zipCode: address.zipCode,
        phoneNumber: address.phoneNumber,
        address: address.address,
        addressCode: {
          district: address.addressCode.district,
          province: address.addressCode.province,
          ward: address.addressCode.ward,
          street: address.addressCode.street
        },
        code: address.code,
      })
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },
  getUserDeliveryInfo: async (req, res) => {
    try {
      const payload = await orderService.getDeliveryInfoById(req.payload._id)
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },
  deleteDeliveryInfo: async (req, res) => {
    const {addressId} = req.body
    try {
      const payload = await orderService.deleteDeliveryInfoByAddressId(req.payload._id, addressId)
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },
  updateDeliveryInfo: async (req, res) => {
    const {addressId, address} = req.body
    try {
      const payload = await orderService.updateDeliveryInfo(req.payload._id, 
        addressId, 
        {
          name: address.name,
          zipCode: address.zipCode,
          phoneNumber: address.phoneNumber,
          address: address.address,
          code: address.code,
          addressCode:{
            district: address.addressCode.district,
            province: address.addressCode.province,
            ward: address.addressCode.ward,
            street: address.addressCode.street
          }
        })
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },
  setDefaultDeliveryInfo: async (req, res) => {
    const {addressId} = req.body
    try {
      const payload = await orderService.setDefaultDeliveryInfo(req.payload._id, addressId)
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },

  //order
  addOrder: async (req, res) => {
    const {order} = req.body
    try {
      const payload = await orderService.addOrder(req.payload._id, order)
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },
  getDetailOrder: async (req, res) => {
    const {orderId} = req.body
    try {
      const payload = await orderService.getOrderById(req.payload._id, orderId)
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },
  getOrderList: async (req, res) => {
    try {
      const payload = await orderService.getAllOrders(req.payload._id, req.query)
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },
  getAllOrdered: async (req, res) => {
    const {currentPage, limit} = req.query
    try {
      const payload = await orderService.getAllOrderedByUser(req.payload._id, currentPage, limit)
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },
  getAllOrdersCancelUser: async (req, res) => {
    const {currentPage, limit} = req.query
    try {
      const payload = await orderService.getAllOrdersCancelByUser(req.payload._id, currentPage, limit)
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },
  getAllOrdersPackedUser: async (req, res) => {
    const {currentPage, limit} = req.query
    try {
      const payload = await orderService.getAllOrdersPackedByUser(req.payload._id, currentPage, limit)    
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },
  getAllOrdersShippingUser: async (req, res) => {
    const {currentPage, limit} = req.query
    try {
      const payload = await orderService.getAllOrdersShippingByUser(req.payload._id, currentPage, limit)
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },
  getAllOrdersCompletedUser: async (req, res) => {
    const {currentPage, limit} = req.query
    try {
      const payload = await orderService.getAllOrdersCompletedByUser(req.payload._id, currentPage, limit)
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  }
  ,
  cancelOrderItem: async (req, res) => {
    const {orderItemId} = req.body
    try {
      const payload = await orderService.cancelOrderItemByUser(req.payload._id, orderItemId)
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },
  cancelOrder: async (req, res) => {
    const {orderId} = req.body
    try {
      const payload = await orderService.cancelOrderByUser(req.payload._id, orderId)
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },
  // seller processing orders
  getOrdersNotDoneOfSeller: async (req, res) => {
    try {
      const payload = await orderService.getOrdersNotDone(req.payload.seller._id, req.query)
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },
  updateStatusOrderBySeller: async (req, res) => {
    try {
      const { orderId } = req.body
      const payload = await orderService.updateStatusOrderBySeller(req.payload._id,orderId)
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },

  

  //shipper
  updateStatusOrderByShipper: async (req, res) => {
    try {
      const {orderId} = req.body
      const payload = await orderService.updateStatusOrderByShipper(req.payload._id,orderId)
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },
  getOrdersShipping: async (req, res) => {
    const {currentPage, limit} = req.query
    try {
      const payload = await orderService.getOrdersShipping(req.payload._id, currentPage, limit)
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  }

}