import container from './container'
import createServer from './server'

const server = createServer(container)

const { config, logger, db } = container

db.on('connecting', () => {
  logger.debug(`connecting to db: ${config.DB_URL}`)
})
db.on('connected', () => {
  logger.info('connected to db')
  server.listen(config.PORT, () => {
    logger.info(`server started at ${config.PORT}`)
  })
})

db.on('disconnected', () => {
  logger.debug('disconnected from db')
})

db.on('error', (err) => {
  logger.error(err)
})

process.on('SIGINT', async () => {
  logger.info('Gracefully shutting down..')
  await db.close()
  process.exit(0)
})
