import { CONFLICT, FORBIDDEN, NOT_FOUND, UNAUTHORIZED } from 'http-status'
import BaseApiError from './base-api-error'

export class DuplicateUserError extends BaseApiError {
  constructor (message) {
    super(message, CONFLICT)
  }
}

export class UserNotFound extends BaseApiError {
  constructor (message) {
    super(message, NOT_FOUND)
  }
}

export class InvalidCredentials extends BaseApiError {
  constructor (message) {
    super(message, UNAUTHORIZED)
  }
}

export class UserNotAuthorized extends BaseApiError {
  constructor (message) {
    super(message, FORBIDDEN)
  }
}
