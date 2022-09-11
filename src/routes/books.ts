import { Router } from 'express'
import { getAllBooksFromUserCtrl } from '../controllers/book.controllers'
import passport from 'passport'

const router = Router()

router.get('/', passport.authenticate('jwt', { session: false }), getAllBooksFromUserCtrl)

export { router }
