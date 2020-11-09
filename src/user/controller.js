import autoBind from 'auto-bind'
import { NO_CONTENT } from 'http-status'

export default class UserController {
  constructor ({ userService }) {
    this.userService = userService
    autoBind(this)
  }

  async register (req, res, next) {
    try {
      const user = await this.userService.register(req.body)

      res.status(201).json({
        message: 'New user created',
        user
      })
    } catch (error) {
      next(error)
    }
  }

  async login (req, res, next) {
    try {
      const token = await this.userService.login(req.body)

      res.json({
        token
      })
    } catch (error) {
      next(error)
    }
  }

  async logout (req, res, next) {
    try {
      await this.userService.logout(req.user, req.headers.authorization.split(' ')[1])

      res.sendStatus(NO_CONTENT)
    } catch (error) {
      next(error)
    }
  }

  async updateRole (req, res, next) {
    try {
      const user = await this.userService.updateRole({
        userId: req.params.userId,
        role: req.body.role
      })

      res.json({
        user
      })
    } catch (error) {
      next(error)
    }
  }

  async getUser (req, res, next) {
    try {
      const user = await this.userService.getUser(req.params.userId || req.user.id)

      res.json({
        user
      })
    } catch (error) {
      next(error)
    }
  }
}
