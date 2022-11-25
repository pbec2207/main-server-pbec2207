const yup = require('yup')
const Message = require('../lang/en')
var that = module.exports = {
  userRegisterSchema : yup.object({
    email: yup.string()
    .required(Message.email_required)
    .email(Message.email_invalid),
    password: yup.string()
    .required(Message.password_required)
    .matches(/^(?=.*[a-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,Message.password_invalid),
    userName: yup.string()
    .required()
    .max(50, Message.name_invalid),
  }),
  userLoginSchema : yup.object({
    email: yup.string()
    .required(Message.email_required)
    .email(Message.email_invalid),
    password:yup.string()
    .required(Message.password_required)
    .matches(/^(?=.*[a-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,Message.password_invalid)
  }),
  userCheckEmail: yup.object({
    email: yup.string()
    .required(Message.email_required)
    .email(Message.email_invalid),
  }),
  userCheckPassword: yup.object({
    password:yup.string()
    .required(Message.password_required)
    .matches(/^(?=.*[a-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,Message.password_invalid)
  })
}
