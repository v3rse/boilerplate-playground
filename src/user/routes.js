import { Router } from 'express'
import createUserModel, { createTokenBlacklistModel } from './model'
import UserService from './service'
import UserController from './controller'
import { registerDetailsSchema, loginDetailsSchema, updateRoleParamSchema, updateRoleBodySchema } from './validation'
import validateBody from '../middleware/validate-body'
import validateParams from '../middleware/validate-params'
import isAuthenticated from '../middleware/is-authenticated'
import isRole from '../middleware/is-role'

export default function createRoute (container) {
  const router = Router()
  const model = createUserModel(container)
  const tokenBlackListModel = createTokenBlacklistModel(container)
  const service = new UserService({ ...container, userModel: model, tokenBlackListModel })
  const controller = new UserController({ ...container, userService: service })

  router.get('/profile', isAuthenticated(container), controller.getUser)
  router.post('/register', validateBody(registerDetailsSchema), controller.register)
  router.patch('/:userId/role', isAuthenticated(container), isRole('admin'), [validateParams(updateRoleParamSchema), validateBody(updateRoleBodySchema)], controller.updateRole)
  router.post('/login', validateBody(loginDetailsSchema), controller.login)
  router.post('/logout', isAuthenticated(container), controller.logout)

  return router
}
