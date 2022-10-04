import { Types } from 'mongoose'
import { Book } from '../entities/book.entity'
import BookModel from '../models/book.model'

class BookServices {
  async getAllBooksByUser (userId: string) {
    const allBooks = await BookModel.find({ user: userId })
      .sort({ updatedAt: -1 })
    return allBooks
  }

  async getBookByBookId (bookId: string, userId: string) {
    try {
      const book = await BookModel.findOne({ _id: bookId, user: userId })
      return book
    } catch (error) {
      return null
    }
  }

  async createBook ({ name, describe }: Book, userId: string) {
    const book = new BookModel({ name, describe, user: userId })
    await book.save()
    return book
  }

  async editBook (bookId: string, props: Partial<Book>) {
    try {
      const book = await BookModel.findByIdAndUpdate(bookId, props, { new: true })
      return book
    } catch (error) {
      return null
    }
  }

  async deleteBook (bookId: string) {
    try {
      const book = await BookModel.findByIdAndDelete(bookId)
      return book
    } catch (error) {
      return null
    }
  }

  async addNoteToBook (bookId: string | Types.ObjectId, noteId: string | Types.ObjectId) {
    try {
      const book = await BookModel.findByIdAndUpdate(bookId, { $push: { notes: noteId } }, { new: true })
      return book
    } catch (error) {
      return null
    }
  }

  async removeNoteFromBook (bookId: string | Types.ObjectId, noteId: string | Types.ObjectId) {
    try {
      const book = await BookModel.findByIdAndUpdate(bookId, { $pull: { notes: noteId } }, { new: true })
      return book
    } catch (error) {
      return null
    }
  }

  async existBook (bookId: string | Types.ObjectId): Promise<boolean> {
    try {
      const book = await BookModel.findById(bookId)
      return book !== null
    } catch (error) {
      return false
    }
  }
}

export default BookServices
