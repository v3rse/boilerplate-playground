import http from 'http'

import createApp from './app'

export default function createServer (container) {
  return http.createServer(createApp(container))
}
