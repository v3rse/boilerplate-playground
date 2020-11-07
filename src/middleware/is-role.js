import { InvalidCredentials, UserNotAuthorized } from '../utils/errors'

export default function getIsAuthorizedMiddleware (requiredRole) {
  return async function (req, res, next) {
    try {
      if (!req.user) {
        throw new InvalidCredentials('User not logged in')
      }

      const { role } = req.user

      if (role !== requiredRole) {
        throw new UserNotAuthorized('User is not authorized for this action')
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}
