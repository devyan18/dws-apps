import { Request, Response } from 'express'
import httpErrorHandler from '../handlers/http_error.handler'
import BookServices from '../services/book.services'

const bookServices = new BookServices()

const getAllBooksFromUserCtrl = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId
    const allBooks = await bookServices.getAllBooksByUser(userId)
    res.status(200).json(allBooks)
  } catch (error) {
    httpErrorHandler(new Error('Unexpected Error'), res, 500)
  }
}

export { getAllBooksFromUserCtrl }
