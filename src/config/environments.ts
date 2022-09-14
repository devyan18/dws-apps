const { JWT_SECRET, MONGODB_URI, MONGO_URI_TEST, NODE_ENV, PORT } = process.env

const DEFAULT_PORT = 4009
const DEFAULT_JWT_SECRET = 'secret'

export default {
  PORT: PORT || DEFAULT_PORT,
  MONGO_URI: (
    NODE_ENV === 'test'
      ? MONGO_URI_TEST || ''
      : NODE_ENV === 'production'
        ? MONGODB_URI || ''
        : MONGO_URI_TEST || ''
  ),
  JWT_SECRET: JWT_SECRET || DEFAULT_JWT_SECRET
}
