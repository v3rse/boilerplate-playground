import pino from 'pino'

function isTestMode (nodeEnv) {
  return nodeEnv === 'test'
}

const REDACTED_FIELDS = [
  'headers.authorization',
  '*.password'
]

export default function createLogger ({ config, label, level }) {
  const isNonTest = !isTestMode(config.NODE_ENV)

  const options = {
    enabled: isNonTest,
    name: label,
    level: level || 'info',
    formatters: {
      level (label, number) {
        return { level: config.NODE_ENV === 'development' ? label : number }
      }
    },
    redact: {
      paths: REDACTED_FIELDS,
      censor: 'REDACTED'
    }
  }

  if (config.NODE_ENV === 'development') {
    options.prettyPrint = {
      colorize: true,
      translateTime: 'SYS:HretuiiH:MM:ss.l',
      ignore: 'pid,hostname'
    }
  }

  return pino(options)
};
