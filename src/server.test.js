import { afterAll } from '@jest/globals'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import createServer from './server'
import createDbConnection from './db'

const mongod = new MongoMemoryServer()

describe('Main', () => {
  let api
  let server
  let db

  beforeAll(async () => {
    const dbUri = await mongod.getUri()
    db = createDbConnection({ connectionUrl: dbUri })
    server = createServer({ db })
    api = request(server)
  })

  afterAll(async () => {
    await server.close()
    await db.close()
    await mongod.stop()
  })
  it('should return "Hello Nana"', async () => {
    const response = await api.get('/')
    expect(response.text).toBe('Hello Nana')
  })

  it('should return 200', async () => {
    const response = await api.get('/')
    expect(response.status).toBe(200)
  })
})
