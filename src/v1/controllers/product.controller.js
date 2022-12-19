const createError = require('http-errors')
const productService = require('../services/product.service')
const _ = require('lodash')
const {generateOtp} = require('../utils')
const shortid = require("shortid");
const slugify = require("slugify");
var that = module.exports = {
  addProduct: async (req, res) => {
    const product = req.body
    const specs = product.specs.map((spec) => {
      return {
        k: Object.keys(spec)[0],
        v: Object.values(spec)[0]
      }
    })

    try {
      const payload = await productService.addProduct({
        name: product.name,
        slug : `${slugify(product.name)}-${shortid.generate()}`,
        sellerId:req.payload._id,
        originPrice: product.originPrice,
        currentPrice:product.originPrice,
        summary: product.summary,
        description: product.description,
        category: product.category,
        quantity: product.quantity,
        city:product.city,
        releaseDate:product.releaseDate,
        endDate: product.endDate, 
        productPictures: _.isEmpty(product.productPictures)
        ? [
          {
            fileLink:'',
            fileId:''
          }
        ]: product.productPictures,
        description:product.description,
        specs: _.isEmpty(product.specs) ? [] : specs
      })
      return res.json(payload)
    } catch (error) {
      return res.status(error.status).json(error)
    }
  },
  getProducts:async (req, res) => {
    const limit = req.query.limit 
      ? req.query.limit == 5 ? req.query.limit : req.query.limit == 10
      ? req.query.limit : process.env.RES_PER_PAGE
      : process.env.RES_PER_PAGE
    try {
      const payload = await productService.getProducts(req.query, limit)
      return res.json(payload)
    } catch (error) {
      return res.status(error.status).json(error)
    }
  },
  getSingleProduct:async (req, res) => {
    const {slug} = req.params;
    try {
      const payload = await productService.getProductBySlug(slug)
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },
  getProductByCategorySlug:async (req, res) => {
    try {
      const payload = await productService.getProductByCategorySlug(req.query)
      res.json(payload)
    } catch (error) {
      console.log(error)
      res.status(error.status).json(error)
    }
  },
  searchProducts:async (req, res) => {
    try {
      const payload = await productService.searchFeature(req.query.keyword)
      res.json(payload)
    } catch (error) {
      console.log(error)
      res.status(error.status).json(error)
    }
  },
  updateProduct: async (req, res) => {
    const { slug, price } = req.body
    try {
      const payload = await productService.updateProduct({
        slug: slug,
        user: req.payload._id,
        price: price
      })
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  },
  deleteProduct: async (req, res) => {
    console.log('here')
    const {id} = req.params
    try {
      const payload = await productService.deleteProductById(id, req.payload.seller._id)
      res.json(payload)
    } catch (error) {
      res.status(error.status).json(error)
    }
  }
}