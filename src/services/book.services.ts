import { Book } from '../entities/book.entity'
import BookModel from '../models/book.model'

class BookServices {
  async getAllBooksByUser (userId: string) {
    const allBooks = await BookModel.find({ user: userId })
    return allBooks
  }

  async getBookByBookId (bookId: string, userId: string) {
    const book = await BookModel.findOne({ _id: bookId, user: userId })
    return book
  }

  async createBook ({ name }: Book, userId: string) {
    const book = new BookModel({ name, user: userId })
    await book.save()
    return book
  }

  async editBook (bookId: string, props: Partial<Book>) {
    const book = await BookModel.findByIdAndUpdate(bookId, props, { new: true })
    return book
  }

  async deleteBook (bookId: string) {
    const book = await BookModel.findByIdAndDelete(bookId)
    return book
  }
}

export default BookServices
