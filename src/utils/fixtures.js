import faker from 'faker'

export const clientUserData = {
  name: 'John',
  lastname: 'Doe',
  username: 'jd',
  password: 'topsecret',
  age: 30
}

export const adminUserData = {
  name: 'King',
  lastname: 'Man',
  username: 'overlord',
  password: 'private',
  age: 30,
  role: 'admin'
}

export const productData = {
  name: 'Anne Pro 2',
  description: 'This is a pretty decent budget keyboard',
  price: 49.99
}

export const multipleProductsData = Array.from({ length: 5 }).map(() => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: faker.commerce.price()
}))
