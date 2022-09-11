import supertest from 'supertest'
import mongoose from 'mongoose'
import BookModel from '../models/book.model'

import { app, server } from '../index'

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzFkMjhmOGU2YWFkMDQ0ODljNWM0MjAiLCJpYXQiOjE2NjI4NTU0ODB9.V8dnFTyRtGNrm7de733v5FZMvFIyfmjub9ZTWOqzdME'

const request = supertest(app)

describe('GET /books', () => {
  test('Should return status code 401 if dont have a session token', async () => {
    const response = await request.get('/api/v1/books')
    expect(response.status).toBe(401)
  })

  test('Should return status code 401 if have a session token invalid', async () => {
    const response = await request.get('/api/v1/books').set('Authorization', 'Bearer 123456')
    expect(response.status).toBe(401)
  })

  test('Should return status code 200 if have a session token valid', async () => {
    const response = await request.get('/api/v1/books').set('Authorization', `Bearer ${TOKEN}`)
    expect(response.status).toBe(200)
  })
})

afterAll(async () => {
  await BookModel.deleteMany({})
  mongoose.connection.close()
  return server.close()
})
