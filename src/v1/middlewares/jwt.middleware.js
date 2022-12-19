const JWT = require('jsonwebtoken')
const {errorResponse} = require('../utils')
const createError = require('http-errors')
const Message = require('../lang/en')
var that = module.exports = {
  verifyAccessToken : (req, res, next) => {
    const token = req.cookies.access_token;
    if(token){
      JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if(err){
          if(err.name === "JsonWebTokenError"){
            return res.status(409).json(errorResponse(409, err.message))
          }
          return res.status(409).json(errorResponse(409,err.message))
        }
        req.payload = payload
        next()
      })
    }else{
      return res.status(404).json(errorResponse(404,createError.NotFound()))
    }
  },
  isAuthAdmin: async (req, res, next) => {
    const token = req.cookies.access_token
    if(token){
      JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if(err){
          if(err.name === "JsonWebTokenError"){
            return res.status(409).json(errorResponse(409,createError.Unauthorized()))
          }
          return res.status(409).json(errorResponse(409,createError.Unauthorized(err.message)))
        }
        if(!(payload.role === "admin")){
         return res.status(403).json(errorResponse(403, createError.Unauthorized(Message.invalid_permission)))
        }
        req.payload = payload
        next()
      })
    }else{
      return res.status(403).json(errorResponse(403, createError.Unauthorized().message))
    }
  },
  isAuthMobile: (req, res, next) => {
    const authorization = req.headers.authorization;
    if(authorization){
        const token = authorization.slice(7,authorization.length); //Bearer xxx
        JWT.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err,decode) => {
              if(err){
                console.log(err)
                if(err.name === "JsonWebTokenError"){
                  return res.status(409).json(errorResponse(409,createError.Unauthorized().message))
                }
                return res.status(409).json(errorResponse(409,createError.Unauthorized(err.message)))
              }
              req.payload = decode
              next()
            }
        );
    }else{
        res.status(403).json(errorResponse(403, createError.NotFound().message));
    }
  },
  isAuthShipper: async (req, res, next) => {
    const token = req.cookies.access_token
    if(token){
      JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if(err){
          if(err.name === "JsonWebTokenError"){
            return res.status(409).json(errorResponse(409,createError.Unauthorized().message))
          }
          return res.status(409).json(errorResponse(409,createError.Unauthorized(err.message)))
        }
        if(!(payload.role === "shipper")){
         return res.status(403).json(errorResponse(403, createError.Unauthorized(Message.invalid_permission)))
        }
        req.payload = payload
        next()
      })
    }else{
      return res.status(403).json(errorResponse(403, createError.NotFound().message))
    }
  },
  isAdminMobile : (req, res, next) => {
    if(req.payload?.role === "admin"){
        next();
    }else{
      return res.status(409).json(errorResponse(409,createError.Unauthorized().message))
    }
  }
}
