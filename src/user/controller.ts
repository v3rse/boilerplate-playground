import { CREATED } from 'http-status'
import { Body, Controller, HttpCode, Post } from 'routing-controllers'
import { User } from './dto'

@Controller('/users')
export class UserController {
  constructor ({ userService }) {
    this.userService = userService
  }

  @HttpCode(CREATED)
  @Post('/register')
  async register (@Body() userDetails: User) {
    // const user = await this.userService.register(userDetails)

   return {
      message: 'New user created',
      user: userDetails
    }
  }
}