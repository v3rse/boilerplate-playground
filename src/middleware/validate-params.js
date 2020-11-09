import { BAD_REQUEST } from 'http-status'

export default function getvalidateParamsMiddleware (schema) {
  return async function validateParamsMiddleware (req, res, next) {
    const { error } = await schema.validate(req.params)

    if (error) {
      return res.status(BAD_REQUEST).json({ errors: error.details })
    }

    next()
  }
}
