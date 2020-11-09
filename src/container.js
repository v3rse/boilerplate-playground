import loadConfig from './config'
import createLogger from './logger'
import createDbConnection from './db'

const config = loadConfig()

const db = createDbConnection({ connectionUrl: config.DB_URL })

const logger = createLogger({ config, label: config.LOG_LABEL, level: config.LOG_LEVEL })

export default {
  db,
  config,
  logger
}
