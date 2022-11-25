const categoryService = require('../services/category.service')
var that = module.exports = {
  addCategory:async (req, res) => {
    const {name} = req.body
    console.log(name)
    try {
      const payload = await categoryService.addCategory({name})
      res.json(payload)      
    } catch (error) {
      res.status(error.status).json(error)
    }
  },
  getAllCategories: async (req, res) => {
    try {
      const payload = await categoryService.getAllCategories()
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  }
}