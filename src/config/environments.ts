const DEFAULT_MONGODB_URI = 'mongodb://127.0.0.1:27017/dws-apps'
const DEFAULT_MONGODB_URI_TEST = 'mongodb://127.0.0.1:27017/dws-apps'
const DEFAULT_PORT = 4009
const DEFAULT_JWT_SECRET = 'secret'

const { JWT_SECRET, MONGO_URI, NODE_ENV, PORT } = process.env

export default {
  PORT: PORT || DEFAULT_PORT,
  MONGO_URI: (
    NODE_ENV === 'test'
      ? DEFAULT_MONGODB_URI_TEST
      : MONGO_URI
  ) || DEFAULT_MONGODB_URI,
  JWT_SECRET: JWT_SECRET || DEFAULT_JWT_SECRET
}
