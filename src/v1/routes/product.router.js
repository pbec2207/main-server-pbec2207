const categoryController = require('../controllers/category.controller')
const productController = require('../controllers/product.controller')
const { isAuthMobile, isAdminMobile } = require('../middlewares/jwt.middleware')
const validation = require('../middlewares/validation.middleware')

const {
  addCategorySchema,
  addProductSchema,
  editProductSchema
} = require('../validations/product.validation')
module.exports = productRouter= (router) => {
  // category routes
  router.post('/admin/add-category',isAuthMobile,isAdminMobile , validation(addCategorySchema), categoryController.addCategory)
  router.get('/categories', categoryController.getAllCategories)
  // product routes
  router.post('/seller/add-product', isAuthMobile, validation(addProductSchema),productController.addProduct)
  router.put('/seller/update-product', isAuthMobile, productController.updateProduct)
  router.delete('/seller/delete-product/:id', isAdminMobile, productController.deleteProduct)
  router.get('/products', productController.getProducts)
  router.get('/category', productController.getProductByCategorySlug)
  router.get('/product/:slug', productController.getSingleProduct)
  router.get('/search', productController.searchProducts)
}