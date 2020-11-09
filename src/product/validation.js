import joi from 'joi'

export const createProductSchema = joi.object({
  name: joi.string().required(),
  price: joi.number().required(),
  description: joi.string().required()
})

export const getProductSchema = joi.object({
  productId: joi.string().required()
})

export const listProductsSchema = joi.object({
  limit: joi.number(),
  page: joi.number()
})
