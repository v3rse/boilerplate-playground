import * as bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import autoBind from 'auto-bind'
import omit from 'lodash/omit'
import { DuplicateUserError, InvalidCredentialsError, UserNotFoundError } from '../utils/errors'

export default class UserService {
  constructor ({ config, logger, userModel, tokenBlackListModel }) {
    this.config = config
    this.logger = logger
    this.userModel = userModel
    this.tokenBlackListModel = tokenBlackListModel
    autoBind(this)
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

  async login (userDetails) {
    const user = await this.userModel.findOne({ username: userDetails.username })

    if (!user) {
      throw new UserNotFoundError('User doesn\'t exists')
    }

    if (!(await this.validatePassword(userDetails.password, user.password, user.salt))) {
      throw new InvalidCredentialsError('Invalid credentials')
    }

    const jwtPayload = { id: user._id, username: user.username, role: user.role }

    return jwt.sign(jwtPayload, this.config.JWT_SECRET, { expiresIn: this.config.JWT_EXPIRY })
  }

  async logout (userDetails, token) {
    await this.tokenBlackListModel.create({
      user: userDetails.id,
      token
    })
  }

  async getUser (userId) {
    const userProfile = await this.userModel.findOne({ _id: userId }).lean()

    if (!userProfile) {
      throw new UserNotFoundError('User doesn\'t exists')
    }

    return omit(userProfile, ['password', 'salt'])
  }

  async updateRole ({ userId, role }) {
    const updatedUser = await this.userModel.findOneAndUpdate({ _id: userId }, { role })

    if (!updatedUser) {
      throw new UserNotFoundError('User doesn\'t exists')
    }

    return omit(updatedUser, ['password', 'salt'])
  }

  async validatePassword (password, hash, salt) {
    const currentHash = await bcrypt.hash(password, salt)

    return hash === currentHash
  }
}
