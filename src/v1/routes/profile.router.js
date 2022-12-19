const profileController = require('../controllers/profile.controller')
const { isAuthMobile } = require('../middlewares/jwt.middleware')
const validation = require('../middlewares/validation.middleware')
const {
  changePasswordSchema,
  updateProfileSchema
} = require('../validations/user.validation') 
module.exports = profileRouter= (router) => {
  router.get('/profile/user-info-mobile',isAuthMobile, profileController.getUserInfoMobile)
  router.post('/profile/change-password-mobile', isAuthMobile, validation(changePasswordSchema), profileController.changePasswordMobile)
  router.post('/profile/update-profile-mobile', isAuthMobile,validation(updateProfileSchema), profileController.updateProfileMobile)
}
