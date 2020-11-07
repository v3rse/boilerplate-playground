import express from 'express'

const app = express()

export default function createApp (container) {
  app.get('/', (req, res) => {
    res.send('Hello Nana')
  })

  return app
}
