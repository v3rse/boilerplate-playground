import { afterAll } from '@jest/globals'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import createServer from './server'
import createDbConnection from './db'
import loadConfig from './config'
import createUserModel from './user/model'
import UserService from './user/service'
import { BAD_REQUEST, CREATED, FORBIDDEN, NOT_FOUND, OK, UNAUTHORIZED } from 'http-status'
import createLogger from './logger'

const mongod = new MongoMemoryServer()

describe('API Spec', () => {
  let api
  let server
  let db
  let userModel
  let userService

  beforeAll(async () => {
    const config = loadConfig()
    const logger = createLogger({ config, label: 'test', level: 'debug' })
    const dbUri = await mongod.getUri()
    db = createDbConnection({ connectionUrl: dbUri })
    server = createServer({ db, config, logger })

    userModel = createUserModel({ db })
    userService = new UserService({ config, logger, userModel })

    api = request(server)
  })

  afterAll(async () => {
    await server.close()
    await db.close()
    await mongod.stop()
  })

  describe('/users', () => {
    const root = '/users'
    const clientUserData = {
      name: 'John',
      lastname: 'Doe',
      username: 'jd',
      password: 'topsecret',
      age: 30
    }

    const adminUserData = {
      name: 'King',
      lastname: 'Man',
      username: 'overlord',
      password: 'private',
      age: 30,
      role: 'admin'
    }

    describe('POST /register', () => {
      const userFields = Object.keys(clientUserData)

      let newUser

      beforeEach(() => {
        newUser = { ...clientUserData }
      })

      it('should create new user', async () => {
        const response = await api
          .post(`${root}/register`)
          .send(newUser)
        expect(response.status).toBe(CREATED)
      })

      describe('Failure', () => {
        for (const field of userFields) {
          it(`should return 400 when ${field} is missing`, async () => {
            delete newUser[field]
            const response = await api
              .post(`${root}/register`)
              .send(newUser)
            expect(response.status).toBe(BAD_REQUEST)
          })
        }
      })
    })
    describe('POST /login', () => {
      let loginDetails
      const seedUser = async () => {
        await api
          .post(`${root}/register`)
          .send(clientUserData)
      }

      beforeEach(async () => {
        await seedUser()
        loginDetails =
      {
        username: clientUserData.username,
        password: clientUserData.password
      }
      })

      afterEach(async () => {
        await userModel.deleteMany({})
      })

      it('should login user in successfully with valid details', async () => {
        const response = await api
          .post(`${root}/login`)
          .send(loginDetails)
        expect(response.status).toBe(OK)
      })

      describe('Failure', () => {
        it('should fail if login credentials are wrong', async () => {
          loginDetails.password = 'wrong'
          const response = await api
            .post(`${root}/login`)
            .send(loginDetails)
          expect(response.status).toBe(UNAUTHORIZED)
        })

        it('should fail if user doesn\'t exist', async () => {
          loginDetails.username = 'lost'
          const response = await api
            .post(`${root}/login`)
            .send(loginDetails)
          expect(response.status).toBe(NOT_FOUND)
        })
      })
    })
    describe('PATCH /:userId/role', () => {
      let clientId
      let adminToken
      let clientToken

      beforeAll(async () => {
        clientId = (await userService.register(clientUserData))._id

        // seed admin
        await userService.register(adminUserData)

        // login as admin
        let res = await api
          .post(`${root}/login`)
          .send({
            username: adminUserData.username,
            password: adminUserData.password
          })

        adminToken = res.body.token

        res = await api
          .post(`${root}/login`)
          .send({
            username: clientUserData.username,
            password: clientUserData.password
          })
        clientToken = res.body.token
      })

      afterEach(async () => {
        await userModel.deleteMany({})
      })

      it('should allow admin to update client user role', async () => {
        const response = await api
          .patch(`${root}/${clientId}/role`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            role: 'admin'
          })
        expect(response.status).toBe(OK)
      })

      it('should not allow client to update client user role', async () => {
        const response = await api
          .patch(`${root}/${clientId}/role`)
          .set('Authorization', `Bearer ${clientToken}`)
          .send({
            role: 'admin'
          })
        expect(response.status).toBe(FORBIDDEN)
      })
    })
  })
  describe('/products', () => {})
})
