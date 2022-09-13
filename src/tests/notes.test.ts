import mongoose from 'mongoose'
import superTest from 'supertest'

import { app, server } from '../index'
import bookModel from '../models/book.model'
import userModel from '../models/user.model'

const request = superTest(app)

describe.skip('GET /api/v1/notes', () => {
  test('notes are returned as json', async () => {
    await request
      .get('/api/v1/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(async () => {
  await bookModel.deleteMany({})
  await userModel.deleteMany({})
  mongoose.connection.close()
  return server.close()
})
