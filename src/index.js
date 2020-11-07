import loadConfig from './config'
import createLogger from './logger'
import createServer from './server'
import createDbConnection from './db'

const config = loadConfig()

const db = createDbConnection({ connectionUrl: config.DB_URL })

const logger = createLogger({ config, label: config.LOG_LABEL, level: config.LOG_LEVEL })

const container = {
  db,
  config,
  logger
}

const server = createServer(container)

db.on('connecting', () => {
  logger.debug('connecting to db..')
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
