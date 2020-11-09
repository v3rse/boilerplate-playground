import { Schema } from 'mongoose'

const tokenBlackList = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    index: true
  }
})

export function createTokenBlacklistModel ({ db }) {
  return db.model('TokenBlacklist', tokenBlackList)
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  role: {
    type: String,
    enum: ['client', 'admin'],
    default: 'client'
  },
  salt: {
    type: String,
    required: true
  }
})

export default function createUserModel ({ db }) {
  return db.model('User', userSchema)
}
