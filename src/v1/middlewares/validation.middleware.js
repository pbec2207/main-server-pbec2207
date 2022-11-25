const {errorResponse} = require('../utils/index')
const validation = (schema) => async (req, res, next) => {
  const body = req.body
  try {
    await schema.validate(body)
    next()
  } catch (error) {
    return res.status(405).json(errorResponse(405, error.errors))
  }
}
module.exports = validation