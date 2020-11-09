import { BAD_REQUEST } from 'http-status'

export default function getValidateBodyMiddleware (schema) {
  return async function validateBodyMiddleware (req, res, next) {
    const { error } = await schema.validate(req.body)

    if (error) {
      return res.status(BAD_REQUEST).json({ errors: error.details })
    }

    next()
  }
}
