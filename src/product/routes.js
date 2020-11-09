import { Router } from 'express'
import createProductModel from './model'
import ProductService from './service'
import ProductController from './controller'
import validateBody from '../middleware/validate-body'
import validateParams from '../middleware/validate-params'
import validateQuery from '../middleware/validate-query'
import isAuthenticated from '../middleware/is-authenticated'
import isRole from '../middleware/is-role'
import { createProductSchema, getProductSchema, listProductsSchema } from './validation'

export default function createRoute (container) {
  const router = Router()
  const model = createProductModel(container)
  const service = new ProductService({ ...container, productModel: model })
  const controller = new ProductController({ ...container, productService: service })

  router.post('/', isAuthenticated(container), isRole('admin'), validateBody(createProductSchema), controller.createProduct)
  router.get('/', isAuthenticated(container), validateQuery(listProductsSchema), controller.listProducts)
  router.get('/:productId', isAuthenticated(container), validateParams(getProductSchema), controller.getProduct)

  return router
}
