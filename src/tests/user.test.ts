import supertest from 'supertest'
import mongoose from 'mongoose'
import UserModel from '../models/user.model'

import { app, server } from '../index'

const request = supertest(app)

const testingUsers = [
  {
    username: 'test1',
    email: 'test1@gmail.com',
    password: '123456'
  },
  {
    username: 'test2',
    email: 'test2@gmail.com',
    password: '123456'
  }
]

// afterEach(() => {
//   return jest.restoreAllMocks()
// })

describe('GET /users', () => {
  beforeAll(async () => {
    await UserModel.deleteMany({})
    for (const user of testingUsers) {
      await UserModel.create(user)
    }
  })

  test('Should return status code 200', async () => {
    const response = await request.get('/api/v1/users')
    expect(response.status).toBe(200)
  })

  test('Should return 2 users', async () => {
    const response = await request.get('/api/v1/users')
    expect(response.body.length).toBe(2)
  })

  test('Should return status code 204 if dont exist users', async () => {
    await UserModel.deleteMany({})
    const response = await request.get('/api/v1/users')
    expect(response.status).toBe(204)
  })

  test('Should return status code 500 if unexpected error', async () => {
    jest.spyOn(UserModel, 'find').mockImplementationOnce(() => {
      throw new Error('Unexpected Error')
    })
    const response = await request.get('/api/v1/users')
    expect(response.status).toBe(500)
  })
})

describe('GET /users/:userId', () => {
  beforeAll(async () => {
    await UserModel.deleteMany({})
    for (const user of testingUsers) {
      await UserModel.create(user)
    }
  })

  const user = new UserModel({
    username: 'test3',
    email: 'test3@gmail.com',
    password: '123456'
  })

  const notId = '000000000000000000000000'

  beforeEach(async () => {
    await user.save()
  })

  test('Should return status code 200', async () => {
    const response = await request.get(`/api/v1/users/${user._id}`)
    expect(response.status).toBe(200)
  })

  test('Should return a user', async () => {
    const response = await request.get(`/api/v1/users/${user._id}`)
    expect(response.body.username).toBe(user.username)
  })

  test('Should return status code 204 if user not exist', async () => {
    const response = await request.get(`/api/v1/users/${notId}`)
    expect(response.status).toBe(204)
  })

  test('Should return status code 500 if unexpected error', async () => {
    jest.spyOn(UserModel, 'findById').mockImplementationOnce(() => {
      throw new Error('Unexpected Error')
    })
    const response = await request.get(`/api/v1/users/${user._id}`)
    expect(response.status).toBe(500)
  })
})

describe('POST /users', () => {
  beforeEach(async () => {
    await UserModel.deleteMany({})
    for (const user of testingUsers) {
      await UserModel.create(user)
    }
  })

  const user = {
    username: 'test4',
    email: 'test4@gmail.com',
    password: '123456'
  }

  const userWithoutUsername = {
    email: 'test4@gmail.com',
    password: '123456'
  }

  const userWithoutEmail = {
    username: 'test4',
    password: '123456'
  }

  const userWithoutPassword = {
    username: 'test4',
    email: 'test4@gmail.com'
  }

  const userWithInvalidEmail = {
    username: 'test4',
    email: 'test4gmail.com'
  }

  const userWithInvalidPassword = {
    username: 'test4',
    email: 'test4@gmail.com',
    password: '123'
  }

  test('Should return status code 201', async () => {
    const response = await request.post('/api/v1/users').send(user)
    expect(response.status).toBe(201)
  })

  test('Should return a user', async () => {
    const response = await request.post('/api/v1/users').send(user)
    expect(response.body.username).toBe(user.username)
  })

  test('Should return status code 406 if username is not provided', async () => {
    const response = await request.post('/api/v1/users').send(userWithoutUsername)
    expect(response.status).toBe(406)
  })

  test('Should return status code 406 if email is not provided', async () => {
    const response = await request.post('/api/v1/users').send(userWithoutEmail)
    expect(response.status).toBe(406)
  })

  test('Should return status code 406 if password is not provided', async () => {
    const response = await request.post('/api/v1/users').send(userWithoutPassword)
    expect(response.status).toBe(406)
  })

  test('Should return status code 406 if email is invalid', async () => {
    const response = await request.post('/api/v1/users').send(userWithInvalidEmail)
    expect(response.status).toBe(406)
  })

  test('Should return status code 406 if password is invalid', async () => {
    const response = await request.post('/api/v1/users').send(userWithInvalidPassword)
    expect(response.status).toBe(406)
  })
})

describe('PUT /users/:userId', () => {
  const username = 'test5'
  const newUsername = 'test_changed'

  const user = new UserModel({
    username,
    email: 'test5@gmail.com',
    password: '123456'
  })

  beforeAll(async () => {
    await UserModel.deleteMany({})
    await user.save()
  })

  test('Should return status code 202', async () => {
    const response = await request.put(`/api/v1/users/${user._id}`).send({ username: newUsername })
    expect(response.status).toBe(202)
  })

  test('Shound return user with news params', async () => {
    const response = await request.get(`/api/v1/users/${user._id}`)
    expect(response.body.username).toBe(newUsername)
  })
})

afterAll(async () => {
  await UserModel.deleteMany({})
  mongoose.connection.close()
  return server.close()
})
