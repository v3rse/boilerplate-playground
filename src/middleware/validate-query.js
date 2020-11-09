import { BAD_REQUEST } from 'http-status'

export default function getvalidateQueryMiddleware (schema) {
  return async function validateQueryMiddleware (req, res, next) {
    const { error } = await schema.validate(req.query)

    if (error) {
      return res.status(BAD_REQUEST).json({ errors: error.details })
    }

    next()
  }
}
