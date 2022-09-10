export default {
  PORT: process.env.PORT || 4009,
  MONGO_URI: (
    process.env.NODE_ENV === 'test'
      ? process.env.MONGODB_URI_TEST
      : process.env.MONGO_URI
  ) || 'mongodb://localhost:27017/dws-users',
  JWT_SECRET: process.env.JWT_SECRET || 'secret'
}
