### Setup
1. Install dependencies `npm i` 
2. Create environment file `cp .env.example .env`
3. Build application `npm run build`
4. Run seeder `npm run seed`
5. Run application `npm start` (ensure you have a local mongodb instance)

### Run (using docker)
Run `docker-compose up -d --build`

### Test
Run `npm test`

### Endpoints

#### Register
```
POST /users

{
  "username": "test",
  "name": "Test",
  "lastname": "User",
  "age": 30,
  "password": "secret"
}
```

#### Login
```
POST /users/login

{
  "username": "test",
  "password": "secret"
}
```

#### Logout
```
POST /users/logout
```

#### List Products
```
GET /products
```

#### Get Product
```
GET /products/:productId
```