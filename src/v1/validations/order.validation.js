const yup = require('yup')
const Message = require('../lang/en')
var that = module.exports = {
  addDeliveryInfoSchema: yup.object({
    address: yup.object({
      name: yup.string()
      .required()
      .min(3)
      .max(50),
      phoneNumber: yup.string()
      .required()
      .matches(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/, Message.phone_invalid_format),
      address: yup.string()
      .required()
      .min(10)
      .max(100),
      zipCode:yup.number()
      .integer()
      .min(1000)
      .max(999999),
      code: yup.number()
      .integer()
      .min(0)
    })
  }),
  updateDeliveryInfoSchema:yup.object({
    addressId: yup.string().required(),
    address: yup.object({
      name: yup.string()
      .required()
      .min(3)
      .max(50),
      phoneNumber: yup.string()
      .required()
      .matches(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/, Message.phone_invalid_format),
      address: yup.string()
      .required()
      .min(10)
      .max(100),
      zipCode:yup.number()
      .integer()
      .min(1000)
      .max(999999),
      code: yup.number()
      .integer()
      .min(0)
    })
  })
}