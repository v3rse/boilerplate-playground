import * as bcrypt from 'bcryptjs'
import omit from 'lodash/omit'
import { DuplicateUserError } from '../utils/errors'

export class UserService {
  constructor ({ config, logger, userModel, tokenBlackListModel }) {
    this.config = config
    this.logger = logger
    this.userModel = userModel
    this.tokenBlackListModel = tokenBlackListModel
  }

  async register (userDetails) {
    const salt = await bcrypt.genSalt()

    const password = await bcrypt.hash(userDetails.password, salt)

    const newUser = { ...userDetails, salt, password }

    try {
      const createdUser = await this.userModel.create(newUser)
      this.logger.info(`New user created: ${userDetails.username}`)

      return omit(createdUser, ['password', 'salt'])
    } catch (error) {
      if (error.code === 11000) {
        throw new DuplicateUserError(`User ${userDetails.username} already exists`)
      }
    }
  }

}