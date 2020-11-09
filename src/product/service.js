import autoBind from 'auto-bind'
import omit from 'lodash/omit'
import { ProductNotFoundError } from '../utils/errors'
const omitCreatedBy = product => omit(product, 'created_by')

export default class ProductService {
  constructor ({ config, logger, productModel }) {
    this.config = config
    this.logger = logger
    this.productModel = productModel
    autoBind(this)
  }

  async createProduct (productDetails, userDetails) {
    const createdProduct = await this.productModel.create({ ...productDetails, created_by: userDetails.id })
    return createdProduct
  }

  // eslint-disable-next-line default-param-last
  async listProducts (page = 1, limit = 10, userDetails) {
    const results = await this.productModel.paginate({}, { lean: true, page, limit })

    let products = results.docs

    if (userDetails.role !== 'admin') {
      products = results.docs.map(omitCreatedBy)
    }

    return {
      totalPages: results.totalPages,
      page,
      limit,
      products,
      total: results.totalDocs
    }
  }

  async getProduct (productId, userDetails) {
    let product = await this.productModel.findOne({ _id: productId }).lean()

    if (!product) {
      throw new ProductNotFoundError('Product doesn\'t exists')
    }

    if (userDetails.role !== 'admin') {
      product = omitCreatedBy(product)
    }

    return product
  }
}
