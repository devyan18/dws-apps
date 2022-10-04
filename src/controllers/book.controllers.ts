import { Request, Response } from 'express'
import httpErrorHandler from '../handlers/http_error.handler'
import { IUserModel } from '../models/user.model'
import BookServices from '../services/book.services'

const bookServices = new BookServices()

const getAllBooksFromUserCtrl = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUserModel
    const allBooks = await bookServices.getAllBooksByUser(user._id)
    res.status(200).json(allBooks)
  } catch (error) {
    httpErrorHandler(new Error('Unexpected Error'), res, 500)
  }
}

const getBookByIdCtrl = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId
    const userId = req.user as IUserModel
    const book = await bookServices.getBookByBookId(bookId, userId._id)

    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      })
    }

    res.status(200).json(book)
  } catch (error) {
    httpErrorHandler(new Error('Unexpected Error'), res, 500)
  }
}

const createBookCtrl = async (req: Request, res: Response) => {
  try {
    const userId = req.user as IUserModel
    const book = await bookServices.createBook(req.body, userId._id)
    res.status(201).json(book)
  } catch (error) {
    console.log(error)
    httpErrorHandler(new Error('Unexpected Error'), res, 500)
  }
}

const editBookCtrl = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId
    const book = await bookServices.editBook(bookId, req.body)

    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      })
    }

    res.status(202).json(book)
  } catch (error) {
    httpErrorHandler(new Error('Unexpected Error'), res, 500)
  }
}

const deleteBookCtrl = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId
    const book = await bookServices.deleteBook(bookId)

    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      })
    }

    res.status(202).json(book)
  } catch (error) {
    httpErrorHandler(new Error('Unexpected Error'), res, 500)
  }
}

export {
  getAllBooksFromUserCtrl,
  getBookByIdCtrl,
  createBookCtrl,
  editBookCtrl,
  deleteBookCtrl
}
