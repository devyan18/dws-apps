import { Router } from 'express'
import {
  createBookCtrl,
  deleteBookCtrl,
  editBookCtrl,
  getAllBooksFromUserCtrl,
  getBookByIdCtrl
} from '../controllers/book.controllers'
import passport from 'passport'
import input from '../middlewares/input.middleware'
import bookSchema from '../schemas/book.schemas'

const router = Router()

router.get('/', passport.authenticate('jwt', { session: false }), getAllBooksFromUserCtrl)

router.get('/:bookId', passport.authenticate('jwt', { session: false }), getBookByIdCtrl)

router.post('/', passport.authenticate('jwt', { session: false }), input(bookSchema), createBookCtrl)

router.put('/:bookId', passport.authenticate('jwt', { session: false }), input(bookSchema), editBookCtrl)

router.delete('/:bookId', passport.authenticate('jwt', { session: false }), deleteBookCtrl)

export { router }
