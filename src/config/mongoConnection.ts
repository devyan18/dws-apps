import { connect } from 'mongoose'

export default function connectMongo (URI: string) {
  console.log('Connecting...')
  return connect(URI)
    .then((db) => console.log('Mongodb connected to', db.connection.db.databaseName))
    .catch(error => console.error(error.message))
}
