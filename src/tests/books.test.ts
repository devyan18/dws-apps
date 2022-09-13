import supertest from 'supertest'
import mongoose from 'mongoose'
import BookModel from '../models/book.model'
import UserModel from '../models/user.model'

import { createJwt } from '../utils/createJwt'
import { app, server } from '../index'

const request = supertest(app)

const userCreator = async (): Promise<string> => {
  await UserModel.deleteMany({})
  const newUser = new UserModel({
    username: 'tester',
    email: 'tester@gmail.com',
    password: '123456'
  })
  await newUser.save()
  return newUser._id
}

const bookCreator = async (userId: string, dataBooks: {name:string}[]) => {
  await BookModel.deleteMany({})
  for (const book of dataBooks) {
    const newBook = new BookModel({
      name: book.name,
      user: userId
    })
    await newBook.save()
  }
}

describe('POST /books', () => {
  test('Should return status code 201', async () => {
    const user = await userCreator()
    const tokensito = createJwt(user)

    const response = await request.post('/api/v1/books')
      .set('Authorization', `Bearer ${tokensito}`)
      .send({ name: 'test' })
    expect(response.status).toBe(201)
  })

  test('Should return status code 406 if insert invalid body', async () => {
    const user = await userCreator()
    const tokensito = createJwt(user)

    const response = await request.post('/api/v1/books')
      .set('Authorization', `Bearer ${tokensito}`)
    expect(response.status).toBe(406)
  })

  test('Should return status code 401 if send invalid token', async () => {
    const response = await request.post('/api/v1/books')
      .set('Authorization', 'Bearer 123456')
      .send({ name: 'test' })
    expect(response.status).toBe(401)
  })
})

describe('GET /books', () => {
  test('Should return status code 401 if dont have a session token', async () => {
    const response = await request.get('/api/v1/books')
    expect(response.status).toBe(401)
  })

  test('Should return status code 401 if have a session token invalid', async () => {
    const response = await request.get('/api/v1/books')
      .set('Authorization', 'Bearer 123456')
    expect(response.status).toBe(401)
  })

  test('Should return status code 200 if have a session token valid', async () => {
    const newIdUser = await userCreator()
    const newTokensito = createJwt(newIdUser)

    await bookCreator(newIdUser, [{ name: 'test1' }, { name: 'test2' }])

    const response = await request.get('/api/v1/books')
      .set('Authorization', `Bearer ${newTokensito}`)
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(2)
  })
})

describe('GET /books/:bookId', () => {
  test('Should return status code 401 if dont have a session token', async () => {
    const idUser = await userCreator()
    const newBook = new BookModel({ name: 'test', user: idUser })
    await newBook.save()
    const response = await request.get(`/api/v1/books/${newBook._id}`)
    expect(response.status).toBe(401)
  })

  test('Should return status code 401 if have a session token invalid', async () => {
    const idUser = await userCreator()
    const newBook = new BookModel({ name: 'test', user: idUser })
    await newBook.save()
    const response = await request.get(`/api/v1/books/${newBook._id}`)
      .set('Authorization', 'Bearer 123456')
    expect(response.status).toBe(401)
  })

  test('Should return status code 404 if have a idBook invalid', async () => {
    const newIdUser = await userCreator()
    const tokensito = createJwt(newIdUser)

    const response = await request.get('/api/v1/books/123456')
      .set('Authorization', `Bearer ${tokensito}`)
    expect(response.status).toBe(404)
  })

  test('Should return status code 200 if have a session token valid', async () => {
    const idUser = await userCreator()
    const newBook = new BookModel({ name: 'test', user: idUser })
    await newBook.save()
    const tokensito = createJwt(idUser)

    const response = await request.get(`/api/v1/books/${newBook._id}`)
      .set('Authorization', `Bearer ${tokensito}`)
    expect(response.status).toBe(200)
  })
})

afterAll(async () => {
  await BookModel.deleteMany({})
  await UserModel.deleteMany({})
  mongoose.connection.close()
  return server.close()
})
