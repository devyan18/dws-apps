const { JWT_SECRET, MONGODB_URI, NODE_ENV, PORT } = process.env

const DEFAULT_PORT = 4009
const DEFAULT_JWT_SECRET = 'secret'
const DEFAULT_MONGO_URI = 'mongodb://localhost:27017/dws-apps'

export default {
  PORT: PORT || DEFAULT_PORT,
  MONGO_URI: (
    NODE_ENV === 'test'
      ? DEFAULT_MONGO_URI || ''
      : NODE_ENV === 'production'
        ? MONGODB_URI || ''
        : DEFAULT_MONGO_URI || ''
  ),
  JWT_SECRET: JWT_SECRET || DEFAULT_JWT_SECRET
}
