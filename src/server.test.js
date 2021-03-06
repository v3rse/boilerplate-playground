import { afterAll } from '@jest/globals'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import createServer from './server'
import createDbConnection from './db'
import loadConfig from './config'
import createUserModel, { createTokenBlacklistModel } from './user/model'
import createProductModel from './product/model'
import UserService from './user/service'
import { BAD_REQUEST, CREATED, FORBIDDEN, NOT_FOUND, NO_CONTENT, OK, UNAUTHORIZED } from 'http-status'
import createLogger from './logger'
import { adminUserData, clientUserData, productData, multipleProductsData } from './utils/fixtures'

const mongod = new MongoMemoryServer()

describe('API Spec', () => {
  let api
  let server
  let db
  let userModel, productModel, tokenBlackListModel
  let userService

  beforeAll(async () => {
    const config = loadConfig()
    const logger = createLogger({ config, label: 'test', level: 'debug' })
    const dbUri = await mongod.getUri()
    db = createDbConnection({ connectionUrl: dbUri })
    server = createServer({ db, config, logger })

    userModel = createUserModel({ db })
    userService = new UserService({ config, logger, userModel })

    productModel = createProductModel({ db })

    tokenBlackListModel = createTokenBlacklistModel({ db })

    api = request(server)
  })

  afterAll(async () => {
    await tokenBlackListModel.deleteMany({})
    await server.close()
    await db.close()
    await mongod.stop()
  })

  describe('/users', () => {
    const root = '/users'

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
    describe('POST /logout', () => {
      let clientToken

      beforeAll(async () => {
        await userService.register(clientUserData)
        const res = await api
          .post(`${root}/login`)
          .send({
            username: clientUserData.username,
            password: clientUserData.password
          })
        clientToken = res.body.token
      })

      afterAll(async () => {
        await userModel.deleteMany({})
      })

      it('should log user out', async () => {
        const response = await api
          .post(`${root}/logout`)
          .set('Authorization', `Bearer ${clientToken}`)

        expect(response.status).toBe(NO_CONTENT)
      })

      it('should not allow logout user to make using old token', async () => {
        const response = await api
          .post(`${root}/logout`)
          .set('Authorization', `Bearer ${clientToken}`)

        expect(response.status).toBe(FORBIDDEN)
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

      afterAll(async () => {
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

  describe('/products', () => {
    const root = '/products'
    let adminToken
    let clientToken

    beforeAll(async () => {
      // seed admin
      await userService.register(adminUserData)

      // login as admin
      let res = await api
        .post('/users/login')
        .send({
          username: adminUserData.username,
          password: adminUserData.password
        })

      adminToken = res.body.token

      await userService.register(clientUserData)

      res = await api
        .post('/users/login')
        .send({
          username: clientUserData.username,
          password: clientUserData.password
        })

      clientToken = res.body.token
    })

    afterAll(async () => {
      await userModel.deleteMany({})
    })

    describe('POST /', () => {
      const productFields = Object.keys(productData)

      let newProduct

      beforeEach(() => {
        newProduct = { ...productData }
      })

      afterAll(async () => {
        await productModel.deleteMany({})
      })

      it('should create new product', async () => {
        const response = await api
          .post(`${root}/`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(newProduct)
        expect(response.status).toBe(CREATED)
      })

      describe('Failure', () => {
        for (const field of productFields) {
          it(`should return 400 when ${field} is missing`, async () => {
            delete newProduct[field]
            const response = await api
              .post(`${root}/`)
              .set('Authorization', `Bearer ${adminToken}`)
              .send(newProduct)
            expect(response.status).toBe(BAD_REQUEST)
          })
        }
        it('should not allow client user to create product', async () => {
          const response = await api
            .post(`${root}/`)
            .set('Authorization', `Bearer ${clientToken}`)
            .send(newProduct)
          expect(response.status).toBe(FORBIDDEN)
        })
      })
    })
    describe('GET /:productId', () => {
      let productId

      beforeAll(async () => {
        // create product
        const res = await api
          .post(`${root}/`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(productData)

        productId = res.body.product._id
      })

      afterAll(async () => {
        await productModel.deleteMany({})
      })

      it('should return product', async () => {
        const response = await api
          .get(`${root}/${productId}`)
          .set('Authorization', `Bearer ${adminToken}`)
        expect(response.status).toBe(OK)
        expect(response.body.product.name).toBe(productData.name)
      })

      it('should return "created_by" field for admin user', async () => {
        const response = await api
          .get(`${root}/${productId}`)
          .set('Authorization', `Bearer ${adminToken}`)
        expect(response.body.product.created_by).toBeTruthy()
      })

      it('should not return "created_by" field for non-admin user', async () => {
        const response = await api
          .get(`${root}/${productId}`)
          .set('Authorization', `Bearer ${clientToken}`)
        expect(response.body.product.created_by).toBeUndefined()
      })
    })

    describe('GET /', () => {
      beforeAll(async () => {
        // create products
        for (const product of multipleProductsData) {
          await api
            .post(`${root}/`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send(product)
        }
      })

      afterAll(async () => {
        await productModel.deleteMany({})
      })

      it('should return products', async () => {
        const response = await api
          .get(`${root}/`)
          .set('Authorization', `Bearer ${adminToken}`)
        expect(response.status).toBe(OK)
        expect(response.body.products[0].name).toBe(multipleProductsData[0].name)
      })

      it('should return "created_by" field for admin user', async () => {
        const response = await api
          .get(`${root}/`)
          .set('Authorization', `Bearer ${adminToken}`)
        expect(response.body.products[0].created_by).toBeTruthy()
      })

      it('should not return "created_by" field for non-admin user', async () => {
        const response = await api
          .get(`${root}/`)
          .set('Authorization', `Bearer ${clientToken}`)
        expect(response.body.products[0].created_by).toBeUndefined()
      })

      it('should paginate results', async () => {
        const response = await api
          .get(`${root}/?page=2&limit=2`)
          .set('Authorization', `Bearer ${adminToken}`)

        expect(response.body.products[0].name).toBe(multipleProductsData[2].name)
      })
    })
  })
})
