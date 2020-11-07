import mongoose from 'mongoose'

mongoose.Promise = global.Promise

export default function connectToDatabase ({ connectionUrl }) {
  const options = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 10000,
    autoReconnect: false,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    family: 4
  }

  const connection = mongoose.createConnection()

  process.nextTick(() => connection.openUri(connectionUrl, options, () => {}))
  return connection
};
