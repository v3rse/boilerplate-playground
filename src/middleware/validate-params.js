export default function getvalidateParamsMiddleware (schema) {
  return async function validateParamsMiddleware (req, res, next) {
    const { error } = await schema.validate(req.params)

    if (error) {
      return res.status(400).json({ errors: error.details })
    }

    next()
  }
}
