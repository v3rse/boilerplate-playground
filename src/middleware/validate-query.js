export default function getvalidateQueryMiddleware (schema) {
  return async function validateQueryMiddleware (req, res, next) {
    const { error } = await schema.validate(req.query)

    if (error) {
      return res.status(400).json({ errors: error.details })
    }

    next()
  }
}
