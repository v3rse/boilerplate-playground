import container from '../container'
import createProductModel from '../product/model'
import ProductService from '../product/service'
import createUserModel from '../user/model'
import UserService from '../user/service'
import { adminUserData, clientUserData, multipleProductsData } from './fixtures'

const { logger, db } = container
const userModel = createUserModel({ db })
const userService = new UserService({ ...container, userModel })
const productModel = createProductModel({ db })
const productService = new ProductService({ ...container, productModel })

async function tearDown () {
  logger.info('Tearing down..')
  logger.info('Deleting existing users..')
  await userModel.deleteMany({})
  await productModel.deleteMany({})
}

export async function seedUser () {
  logger.info('Seeding users..')

  await userService.register(adminUserData)

  logger.info(`Seeded admin user: username => ${adminUserData.username} password => ${adminUserData.password}`)

  await userService.register(clientUserData)

  logger.info(`Seeded client user: username => ${clientUserData.username} password => ${clientUserData.password}`)
}

export async function seedProducts (userId) {
  logger.info('Seeding products..')

  for (const product of multipleProductsData) {
    await productService.createProduct(product, { id: userId })
  }

  logger.info(`Seeded ${multipleProductsData.length} product(s)`)
}

async function main () {
  await tearDown()

  await seedUser()

  const adminUser = await userModel.findOne({ username: adminUserData.username })

  await seedProducts(adminUser._id)

  db.close()
  process.exit(0)
}

main()
  .catch(err => {
    logger.error(err)
    process.exit(1)
  })
