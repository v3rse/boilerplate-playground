import jwt from 'jsonwebtoken'
import { createTokenBlacklistModel } from '../user/model'
import { InvalidCredentialsError, UserNotAuthorizedError } from '../utils/errors'

export default function getIsAuthenticatedMiddleware ({ config, db }) {
  return async function (req, res, next) {
    let token
    const tokenBlackListModel = createTokenBlacklistModel({ db })
    try {
      if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1]
        const isBlackListed = await tokenBlackListModel.findOne({ token }).lean()
        if (isBlackListed) {
          throw new UserNotAuthorizedError('Token expired. Login again')
        }
      } else {
        token = req.query.authorization
      }

      try {
        if (token == null) { throw new InvalidCredentialsError('Invalid token') }
        const payload = await jwt.verify(token, config.JWT_SECRET)

        req.user = payload
        next()
      } catch (error) {
        throw new UserNotAuthorizedError('User not authorized to access route')
      }
    } catch (error) {
      next(error)
    }
  }
}
