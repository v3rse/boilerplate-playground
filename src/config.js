import fs from 'fs'
import dotenv from 'dotenv-extended'
import dotenvExpand from 'dotenv-expand'
import dotenvParseVariables from 'dotenv-parse-variables'

import pkg from '../package.json'

export default function loadConfig () {
  if (!fs.existsSync('.env')) {
    return process.env
  }
  let env = dotenv.load({
    silent: false,
    errorOnMissing: true,
    errorOnExtra: true
  })

  env = dotenvExpand(env)

  env = dotenvParseVariables(env)

  env.NODE_ENV = process.env.NODE_ENV
  env.RELEASE_VERSION = pkg.version

  return env
}
