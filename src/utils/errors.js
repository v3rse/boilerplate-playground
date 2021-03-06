import { CONFLICT, FORBIDDEN, NOT_FOUND, UNAUTHORIZED } from 'http-status'
import BaseApiError from './base-api-error'

export class NotFoundError extends BaseApiError {
  constructor (message) {
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
  constructor (message) {
    super(message, CONFLICT)
  }
}

export class InvalidCredentialsError extends BaseApiError {
  constructor (message) {
    super(message, UNAUTHORIZED)
  }
}

export class UserNotAuthorizedError extends BaseApiError {
  constructor (message) {
    super(message, FORBIDDEN)
  }
}
