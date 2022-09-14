import mongoose from 'mongoose'
import superTest from 'supertest'

import { app, server } from '../index'
import bookModel from '../models/book.model'
import NoteModel from '../models/note.model'
import UserModel from '../models/user.model'

import { createJwt } from '../utils/createJwt'
import { bookCreator, userCreator } from './utils'

const request = superTest(app)

beforeEach(async () => {
  await bookModel.deleteMany({})
  await NoteModel.deleteMany({})
  await UserModel.deleteMany({})
})

describe('POST /notes/:bookId', () => {
  test('Should return status code 201', async () => {
    const userId = await userCreator()
    const book = await bookCreator(userId, [{ name: 'book' }])

    const token = createJwt(userId)

    const response = await request
      .post(`/api/v1/notes/${book[0]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New note', content: 'New content' })

    expect(response.status).toBe(201)
    expect(response.body.title).toBe('New note')
    expect(response.body.content).toBe('New content')
    expect(response.body).toHaveProperty('_id')
  })

  test('Should create a new note', async () => {
    const userId = await userCreator()
    const bookId = await bookCreator(userId, [{ name: 'book1' }])

    const token = createJwt(userId)

    const response = await request
      .post(`/api/v1/notes/${bookId[0]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'note1',
        content: 'content1'
      })

    const note = await NoteModel.findOne({ title: 'note1' })

    expect(response.status).toBe(201)
    expect(note).not.toBeNull()
  })

  test('Should return 406 if title is not provided', async () => {
    const userId = await userCreator()
    const bookId = await bookCreator(userId, [{ name: 'book1' }])

    const token = createJwt(userId)

    const response = await request
      .post(`/api/v1/notes/${bookId[0]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'content1'
      })

    expect(response.status).toBe(406)
  })

  test('Should return 406 if content is not provided', async () => {
    const userId = await userCreator()
    const bookId = await bookCreator(userId, [{ name: 'book1' }])

    const token = createJwt(userId)

    const response = await request
      .post(`/api/v1/notes/${bookId[0]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'note1'
      })

    expect(response.status).toBe(406)
  })

  test('Should return 401 if token is not provided', async () => {
    const userId = await userCreator()
    const bookId = await bookCreator(userId, [{ name: 'book1' }])

    const response = await request
      .post(`/api/v1/notes/${bookId[0]}`)
      .send({
        title: 'note1',
        content: 'content1'
      })

    expect(response.status).toBe(401)
  })

  test('Should return 404 if bookId is invalid', async () => {
    const userId = await userCreator()

    const token = createJwt(userId)

    const response = await request
      .post('/api/v1/notes/123456')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'note1',
        content: 'content1'
      })

    expect(response.status).toBe(404)
  })
})

describe('GET /notes/:bookId', () => {
  test('all notes are returned', async () => {
    const userId = await userCreator()
    const token = createJwt(userId)

    const bookIds = await bookCreator(userId, [{
      name: 'book1'
    }])

    const newNote1 = {
      title: 'note1',
      content: 'content1',
      book: bookIds[0],
      user: userId
    }

    const newNote2 = {
      title: 'note2',
      content: 'content2',
      book: bookIds[0],
      user: userId
    }

    const note1 = new NoteModel(newNote1)
    const note2 = new NoteModel(newNote2)

    await note1.save()
    await note2.save()

    const response = await request.get(`/api/v1/notes/${bookIds[0]}`)
      .set('Authorization', `Bearer ${token}`)
    expect(response.body.length).toBe(2)
  })

  test('Should return 401 if token is not provided', async () => {
    const userId = await userCreator()
    const bookIds = await bookCreator(userId, [{
      name: 'book1'
    }])

    const response = await request.get(`/api/v1/notes/${bookIds[0]}`)
    expect(response.status).toBe(401)
  })

  test('Should return 404 if bookId is invalid', async () => {
    const userId = await userCreator()
    const token = createJwt(userId)

    const response = await request.get('/api/v1/notes/123456')
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(404)
  })

  test('Should return 404 if bookId is not found', async () => {
    const userId = await userCreator()
    const token = createJwt(userId)

    const response = await request.get('/api/v1/notes/5f0a7a1a2a8c2f2a3c3e3c3e')
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(404)
  })
})

describe('GET /notes/:bookId/:noteId', () => {
  test('Should return a note', async () => {
    const userId = await userCreator()
    const token = createJwt(userId)

    const bookIds = await bookCreator(userId, [{
      name: 'book1'
    }])

    const newNote1 = {
      title: 'note1',
      content: 'content1',
      book: bookIds[0],
      user: userId
    }

    const note1 = new NoteModel(newNote1)

    await note1.save()

    const response = await request.get(`/api/v1/notes/${bookIds[0]}/${note1._id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(response.body.title).toBe('note1')
  })

  test('Should return 401 if token is not provided', async () => {
    const userId = await userCreator()
    const bookIds = await bookCreator(userId, [{
      name: 'book1'
    }])

    const newNote1 = {
      title: 'note1',
      content: 'content1',
      book: bookIds[0],
      user: userId
    }

    const note1 = new NoteModel(newNote1)

    await note1.save()

    const response = await request.get(`/api/v1/notes/${bookIds[0]}/${note1._id}`)
    expect(response.status).toBe(401)
  })

  test('Should return 404 if bookId is invalid', async () => {
    const userId = await userCreator()
    const token = createJwt(userId)

    const response = await request.get('/api/v1/notes/123456/123456')
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(404)
  })

  test('Should return 404 if noteId is invalid', async () => {
    const userId = await userCreator()
    const token = createJwt(userId)

    const bookIds = await bookCreator(userId, [{
      name: 'book1'
    }])

    const response = await request.get(`/api/v1/notes/${bookIds[0]}/123456`)
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(404)
  })
})

describe('PUT /notes/:noteId', () => {
  test('Should update a note', async () => {
    const userId = await userCreator()
    const token = createJwt(userId)

    const bookIds = await bookCreator(userId, [{
      name: 'book1'
    }])

    const newNote1 = {
      title: 'note1',
      content: 'content1',
      book: bookIds[0],
      user: userId
    }

    const note1 = new NoteModel(newNote1)

    await note1.save()

    const response = await request.put(`/api/v1/notes/${note1._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'note1',
        content: 'content1'
      })
    expect(response.status).toBe(202)
  })

  test('Should return 401 if token is not provided', async () => {
    const userId = await userCreator()
    const bookIds = await bookCreator(userId, [{
      name: 'book1'
    }])

    const newNote1 = {
      title: 'note1',
      content: 'content1',
      book: bookIds[0],
      user: userId
    }

    const note1 = new NoteModel(newNote1)

    await note1.save()

    const response = await request.put(`/api/v1/notes/${note1._id}`)
      .send({
        title: 'note1',
        content: 'content1'
      })
    expect(response.status).toBe(401)
  })

  test('Should return 404 if noteId is invalid', async () => {
    const userId = await userCreator()
    const token = createJwt(userId)

    const response = await request.put('/api/v1/notes/123456')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'note1',
        content: 'content1'
      })
    expect(response.status).toBe(404)
  })

  test('Should return 406 if not provide title', async () => {
    const userId = await userCreator()
    const token = createJwt(userId)

    const bookIds = await bookCreator(userId, [{
      name: 'book1'
    }])

    const newNote1 = {
      title: 'note1',
      content: 'content1',
      book: bookIds[0],
      user: userId
    }

    const note1 = new NoteModel(newNote1)

    await note1.save()

    const response = await request.put(`/api/v1/notes/${note1._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'content1'
      })
    expect(response.status).toBe(406)
  })
})

describe('DELETE /notes/:bookId/:noteId', () => {
  test('Should delete a note', async () => {
    const userId = await userCreator()
    const book = await bookCreator(userId, [{ name: 'book1 1' }])

    const token = createJwt(userId)

    const newNote = await request
      .post(`/api/v1/notes/${book[0]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New note', content: 'New content' })
    expect(newNote.body).toHaveProperty('_id')
    expect(newNote.status).toBe(201)

    const response = await request
      .delete(`/api/v1/notes/${book[0]}/${newNote.body._id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(202)
  })

  test('Should return 401 if token is not provided', async () => {
    const userId = await userCreator()
    const bookIds = await bookCreator(userId, [{
      name: 'book1'
    }])

    const newNote1 = {
      title: 'note1',
      content: 'content1',
      book: bookIds[0],
      user: userId
    }

    const note1 = new NoteModel(newNote1)

    await note1.save()

    const response = await request.delete(`/api/v1/notes/${bookIds[0]}/${note1._id}`)
    expect(response.status).toBe(401)
  })

  test('Should return 404 if noteId or bookId is invalid', async () => {
    const userId = await userCreator()
    const token = createJwt(userId)

    const response = await request.delete('/api/v1/notes/123123123/123456')
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(404)
  })
})

afterAll(async () => {
  await bookModel.deleteMany({})
  await UserModel.deleteMany({})
  await NoteModel.deleteMany({})
  mongoose.connection.close()
  return server.close()
})
