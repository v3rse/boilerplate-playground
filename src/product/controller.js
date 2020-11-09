import autoBind from 'auto-bind'
import { CREATED, OK } from 'http-status'

export default class ProductController {
  constructor ({ productService }) {
    this.productService = productService
    autoBind(this)
  }

  async createProduct (req, res, next) {
    try {
      const product = await this.productService.createProduct(req.body, req.user)

      res.status(CREATED).json({
        message: 'New product created',
        product
      })
    } catch (error) {
      next(error)
    }
  }

  async listProducts (req, res, next) {
    try {
      const results = await this.productService.listProducts(req.query.page, req.query.limit, req.user)

      res.status(OK).json(results)
    } catch (error) {
      next(error)
    }
  }

  async getProduct (req, res, next) {
    try {
      const product = await this.productService.getProduct(req.params.productId, req.user)

      res.status(OK).json({
        product
      })
    } catch (error) {
      next(error)
    }
  }
}
