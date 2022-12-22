const JWT = require('jsonwebtoken')
const _ = require('lodash')
const xssFilter = require('xss-filters')
const authService = require('../services/auth.service')
const jwtService = require('../services/jwt.service')
const redis = require('../databases/init.redis')
const createError = require('http-errors')
const {errorResponse} = require('../utils')
const { setCookies } = require('../utils')

const Message = require('../lang/en')
var that  = module.exports = {
  userLogin: async (req, res) => {
    const { email, password } = req.body
    try {
      const {data, access_token, refresh_token} = await authService.userLogin(xssFilter.inHTMLData(email), password)
      setCookies(res, 'access_token', access_token, Number(process.env.ACCESS_TOKEN_EXPIRED_BY_SECOND))
      setCookies(res, 'refresh_token', refresh_token, Number(process.env.REFRESH_TOKEN_REDIS_EXPIRED))
      res.send({
        data,
        access_token,
        refresh_token
      }) 
    } catch (error) {
      console.log(error)
      res.status(error.status).json(error)
    }
  },
  userRegisterWeb: async (req, res) => {
    const user = req.body
  
    try {
      const data = await authService.userRegisterWeb({
        email:xssFilter.inHTMLData(user.email),
        password:user.password,
        userName:xssFilter.inHTMLData(user.userName)
      })
      res.cookie('active_account', false,
      {
        httpOnly: false,
        maxAge:Number(process.env.ACTIVE_ACCOUNT_COOKIE_EXPIRED),
      })
      .json(data)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },
  activeAccount: async (req, res) => {
    try {
      const {userId,token} = req.query
      await authService.activeAccount(userId,token)
      res.json({
        data:{
          message: "The account is activated"
        }
      })
      //res.redirect(process.env.REDIRECT_ACTIVE_SUCCESS)
    } catch (error) {
      res.status(500).json(error)
    }
  },
  googleLogin: async (req, res) => {
    try {
      const code = req.query.code
      const { id_token, access_token } = await authService.getGoogleOAuthTokens(code)
      const googleUser = await authService.getGoogleUser(id_token, access_token)
      const data = await authService.googleLogin(googleUser)
      setCookies(res,'access_token', data.access_token, Number(process.env.ACCESS_TOKEN_EXPIRED_BY_SECOND))
      setCookies(res,'refresh_token', data.refresh_token, Number(process.env.REFRESH_TOKEN_REDIS_EXPIRED))
      res.redirect(`${process.env.CLIENT_ENDPOINT}/auth/login`)
    } catch (error) {
      console.log(error)
      res.status(error.status).json(error)
    }
  },

  refreshToken :async (req,res) => {
    //const refresh_token = req.cookies.refresh_token
    const authorization = req.headers.authorization;
    if(!authorization) return res.status(404).json({
      status:404,
      "errors":{
        message: "Token not found"
      }
    })
    const refresh_token = authorization.slice(7,authorization.length)
    const checkRedis = await redis.get(refresh_token)
    if(!checkRedis){return res.status(404).json(errorResponse(404,Message.refresh_token_not_expired))}
    JWT.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET,async (err, payload) => {
      if(err){
        console.log(err)
        return res.status(400).json(err)
      }
      if(!(payload._id === checkRedis))  return res.status(403).json(errorResponse(403,Message.token_expired))
      try {
        const token = await jwtService.signAccessToken(payload)
        const refreshToken = await jwtService.signRefreshToken(payload)
        await redis.del(refresh_token)
        setCookies(res,'access_token', token,Number(process.env.ACCESS_TOKEN_EXPIRED_BY_SECOND))
        setCookies(res, 'refresh_token', refreshToken, Number(process.env.REFRESH_TOKEN_REDIS_EXPIRED))
        res.json({data:payload, access_token:token})
      } catch (error) {
        console.log(error)
        res.status(500).json(errorResponse(500, createError.InternalServerError()))
      }
    })
  },
  getCurrentUser: (req, res) => {
    const access_token = req.cookies.access_token
    if(access_token){
      JWT.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if(err){
          console.log('err::',err)
          if(err.name === "JsonWebTokenError"){
            return res.status(409).json({
              status:409,
              "errors":{
                message:createError.Unauthorized()
              }
            })
          }
          return res.status(409).json({
            status:409,
            "errors":{
              message:createError.Unauthorized(err.message)
            }
          })
        }
        return res.send({
          data:payload,
          access_token:access_token
        })
      })
    }
    res.status(400).json({
      status:400,
      "errors":{
        message:Message.token_not_found
      }
    })
  },
  logout:async (req, res) => {
    try {
      const refresh_token = req.cookies.refresh_token
      const x = await redis.del(refresh_token)
      console.log(x)
      setCookies(res,'access_token', null,0)
      setCookies(res, 'refresh_token', null, 0)
      res.send({
        data:{
          message: Message.logout_success
        }
      })  
    } catch (error) {
      console.log(error)
      res.status(400).json({
        status: 400,
        "errors":{
          message:Message.server_wrong
        }
      })
    }
  },
  emailResetPassword:async (req, res) => {
      const {email} = req.body
      try {
        const payload = await authService.sendEmailResetPassword(email)
        res.json(payload)
      } catch (error) {
        res.status(error.status).json(error)
      }
  },
  OTPCodeResetPassword:async (req, res) => {
    const {userId, otp} = req.body
    try {
      const payload = await authService.OTPCode(userId,Number(otp))
      console.log('here')
      console.log(payload)
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },
  resetPassword: async (req, res) => {
    const {userId,token, password} = req.body
    try {
      const payload = await authService.resetPassword(userId,token, password)
      console.log(payload)
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  }
}