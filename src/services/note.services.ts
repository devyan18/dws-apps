import { Types } from 'mongoose'
import { Note } from '../entities/notes.entity'
import NoteModel from '../models/note.model'
import BookServices from './book.services'

interface PropsNote extends Note {
  userId: string
  bookId: string
}

const bookServices = new BookServices()

class NoteServices {
  async existNote (noteId: string | Types.ObjectId): Promise<boolean> {
    try {
      const note = await NoteModel.findById(noteId)
      return note !== null
    } catch (error) {
      return false
    }
  }

  async getAllNotesByBookId (
    bookId: string | Types.ObjectId,
    userId: string | Types.ObjectId
  ) {
    const existBook = await bookServices.existBook(bookId)
    if (!existBook) {
      return null
    }
    const allNotes = await NoteModel.find({ book: bookId, user: userId })
    return allNotes
  }

  async getNoteByNoteIdFromBook (
    noteId: string | Types.ObjectId,
    bookId: string | Types.ObjectId,
    userId: string | Types.ObjectId
  ) {
    const existBook = await bookServices.existBook(bookId)
    const existNote = await this.existNote(noteId)

    if (!existBook || !existNote) {
      return null
    }

    const note = await NoteModel.findOne({ _id: noteId, user: userId, book: bookId })
    return note
  }

  async createNote ({ title, content, bookId, userId }: PropsNote) {
    const existBook = await bookServices.existBook(bookId)
    if (!existBook) {
      return null
    }
    const note = new NoteModel({ title, content, book: bookId, user: userId })
    await note.save()
    await bookServices.addNoteToBook(bookId, note._id)
    return note
  }

  async editNote (
    noteId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    props: Partial<Note>
  ) {
    const existNote = await this.existNote(noteId)

    if (!existNote) {
      return null
    }

    const note = await NoteModel.findOneAndUpdate({ _id: noteId, user: userId }, props, { new: true })
    return note
  }

  async deleteNote (
    bookId: string | Types.ObjectId,
    noteId: string | Types.ObjectId,
    userId: string | Types.ObjectId
  ) {
    const existNote = await this.existNote(noteId)

    if (!existNote) {
      return null
    }

    await bookServices.removeNoteFromBook(bookId, noteId)

    const note = await NoteModel.findOneAndDelete({ _id: noteId, user: userId }, { new: true })
    return note
  }
}

export default NoteServices
