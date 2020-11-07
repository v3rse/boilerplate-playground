import joi from 'joi'

export const registerDetailsSchema = joi.object({
  username: joi.string().required(),
  name: joi.string().required(),
  lastname: joi.string().required(),
  password: joi.string().required(),
  age: joi.number().required()
})

export const loginDetailsSchema = joi.object({
  username: joi.string().required(),
  password: joi.string().required()
})

export const updateRoleBodySchema = joi.object({
  role: joi.string().allow('client', 'admin').required()
})

export const updateRoleParamSchema = joi.object({
  userId: joi.string().required()
})
