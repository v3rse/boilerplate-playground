import 'reflect-metadata'
import { createExpressServer, useContainer } from 'routing-controllers'
import { Container } from 'typedi'

useContainer(Container)

const server = createExpressServer({
  controllers: [__dirname + '/controllers/*.ts']
})

export default server