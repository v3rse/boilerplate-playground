export default function getValidateBodyMiddleware (schema) {
  return async function validateBodyMiddleware (req, res, next) {
    const { error } = await schema.validate(req.body)

    if (error) {
      return res.status(400).json({ errors: error.details })
    }

    next()
  }
}
