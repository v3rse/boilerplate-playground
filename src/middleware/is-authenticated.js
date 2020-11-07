import jwt from 'jsonwebtoken'
import { InvalidCredentials, UserNotAuthorized } from '../utils/errors'

export default function getIsAuthenticatedMiddleware ({ config }) {
  return async function (req, res, next) {
    let token
    try {
      if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1]
      } else {
        token = req.query.authorization
      }

      try {
        if (token == null) { throw new InvalidCredentials('Invalid token') }
        const payload = await jwt.verify(token, config.JWT_SECRET)

        req.user = payload
        next()
      } catch (error) {
        throw new UserNotAuthorized('User not authorized to access route')
      }
    } catch (error) {
      next(error)
    }
  }
}
