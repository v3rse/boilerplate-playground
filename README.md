### Scaffold
1. Clone with depth of one (1) to a folder `git clone [-b <branch>] --depth 1 <url> <folder>`
  - <url> can be remote or local. local urls must start with `file://` with the absolute path
  - <branch> for local upstream repos must be checked out
2. Remove `.git` directory to reinitialize repository

__NB: you could also `degit`. tips found [here](https://bharathvaj.me/blog/scaffolding-new-project-using-template)__

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
