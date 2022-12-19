const profileService = require('../services/profile.service')
const xssFilter = require('xss-filters')
var that = module.exports = {
  getUserInfoMobile: async (req, res) => {
    try {
      const payload = await profileService.getUserInfoById(req.payload._id)
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
      
    }
  },
  changePasswordMobile:async (req, res) => {
    const {oldPassword, newPassword} = req.body
    try {
      const payload = await profileService.changePassword(req.payload._id, oldPassword, newPassword)
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },
  updateProfileMobile: async (req, res) => {
    const {profile} = req.body
    try {
      const payload = await profileService.updateProfile(
        req.payload._id,{
          address: xssFilter.inHTMLData(profile.address),
          phone: xssFilter.inHTMLData(profile.phone),
          firstName: xssFilter.inHTMLData(profile.firstName),
          lastName: xssFilter.inHTMLData(profile.lastName),
          avatar: xssFilter.inHTMLData(profile.avatar),
          birthDay: profile.birthDay,
          language: profile.language,
          gender: profile.gender
        }
        )
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  }
}