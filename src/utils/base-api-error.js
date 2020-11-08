export default class BaseApiError extends Error {
  constructor (message, status) {
    super(message)
    this.name = this.constructor.name
    this.status = status
    Error.captureStackTrace(this, this.constructor)
  }
}
