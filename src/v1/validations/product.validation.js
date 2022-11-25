const yup = require('yup')
const Message = require('../lang/en')
var that = module.exports = {
  addCategorySchema : yup.object({
    name: yup.string()
    .required(Message.category_required)
    .min(2,Message.category_min_length)
    .max(100, Message.category_max_length),
  }),
  addProductSchema: yup.object({
    name: yup.string()
    .required(Message.name_required)
    .min(2, Message.name_min_invalid)
    .max(150, Message.product_name_max),
    category:yup.string()
    .required(Message.category_required)
    .min(2, Message.category_min_length)
    .max(50, Message.category_max_length),
    quantity:yup.string()
    .required(Message.quantity_required)
    .matches(/^[1-9]\d*$/, Message.wrong_number),
    summary: yup.string()
    .max(150, Message.summary_max),
    city: yup.string()
    .required(Message.city)
    .min(2, Message.name_min_invalid)
    .max(32, Message.name_min_invalid),
    originPrice:yup
    .number()
    .positive()
    .min(0)

  }),
  editProductSchema: yup.object({
    product: yup.object({
      name: yup.string()
      .required(Message.name_required)
      .min(2, Message.name_min_invalid)
      .max(150, Message.product_name_max),
      author: yup.string()
      .required(Message.author_required)
      .min(2, Message.name_min_invalid)
      .max(32, Message.name_invalid),
      publisher: yup.string()
      .required(Message.publisher_required)
      .min(2, Message.name_min_invalid)
      .max(32, Message.name_invalid),
      printLength: yup.string()
      .matches(/^[1-9]\d*$/, Message.wrong_number),
      language:yup.string()
      .required(Message.language_required)
      .min(2, Message.name_min_invalid)
      .max(20, Message.language_max),
      category:yup.string()
      .required(Message.category_required)
      .min(2, Message.category_min_length)
      .max(50, Message.category_max_length),
      publicationDate: yup.string()
      .required(Message.publication_date_required)
      .matches(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/, Message.date_not_existed),
      discountPercent:yup.string()
      .matches(/^100(\.(0){0,2})?$|^([1-9]?[0-9])(\.(\d{0,2}))?$/, Message.percentage_wrong_format),
      quantity:yup.string()
      .required(Message.quantity_required)
      .matches(/^[1-9]\d*$/, Message.wrong_number),
      summary: yup.string()
      .max(150, Message.summary_max),
      city: yup.string()
      .required(Message.city)
      .min(2, Message.name_min_invalid)
      .max(32, Message.name_min_invalid)

    })
    
  })
}
