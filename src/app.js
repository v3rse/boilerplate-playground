import express from 'express'
import bodyParser from 'body-parser'
import getUserRoutes from './user/routes'

const app = express()

export default function createApp (container) {
  const { logger } = container
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  // set up routes
  app.use('/users', getUserRoutes(container))

  app.use((err, req, res, next) => {
    logger.error(err)
    res.status(err.status || 500)
    res.json({
      error: err.message
    })
  })

  return app
}
