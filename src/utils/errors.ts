import { CONFLICT, FORBIDDEN, NOT_FOUND, UNAUTHORIZED } from 'http-status'

export class BaseApiError extends Error {
  constructor (message: string, private status: number) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotFoundError extends BaseApiError {
  constructor (message: string) {
    super(message, NOT_FOUND)
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor (message = 'User not found') {
    super(message)
  }
}

export class ProductNotFoundError extends NotFoundError {
  constructor (message = 'Product not found') {
    super(message)
  }
}

export class DuplicateUserError extends BaseApiError {
  constructor (message: string) {
    super(message, CONFLICT)
  }
}

export class InvalidCredentialsError extends BaseApiError {
  constructor (message: string) {
    super(message, UNAUTHORIZED)
  }
}

export class UserNotAuthorizedError extends BaseApiError {
  constructor (message: string) {
    super(message, FORBIDDEN)
  }
}