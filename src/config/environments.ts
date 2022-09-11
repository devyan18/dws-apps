const DEFAULT_MONGODB_URI = 'mongodb://127.0.0.1:27017/dws-apps'
const DEFAULT_MONGODB_URI_TEST = 'mongodb://127.0.0.1:27017/dws-apps'
const DEFAULT_PORT = 4009
const DEFAULT_JWT_SECRET = 'secret'

export default {
  PORT: process.env.PORT || DEFAULT_PORT,
  MONGO_URI: (
    process.env.NODE_ENV === 'test'
      ? DEFAULT_MONGODB_URI_TEST
      : process.env.MONGO_URI
  ) || DEFAULT_MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET || DEFAULT_JWT_SECRET
}
