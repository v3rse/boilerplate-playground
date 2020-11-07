import { afterAll } from '@jest/globals'
import request from 'supertest'
import server from './server'

describe('Main', () => {
  let api

  beforeAll(() => {
    api = request(server)
  })

  afterAll(async () => {
    await server.close()
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
