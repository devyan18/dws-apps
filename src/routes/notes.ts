import { Router } from 'express'
import passport from 'passport'
import {
  createNewNoteInBookCtrl,
  getAllNotesByBookIdCtrl,
  getOneNoteByNoteIdFromBookCtrl,
  editOneNoteCtrl,
  deleteOneNoteCtrl
} from '../controllers/notes.controllers'
import input from '../middlewares/input.middleware'
import noteSchema from '../schemas/notes.schema'

const router = Router()

router.post('/:bookId', passport.authenticate('jwt', { session: false }), input(noteSchema), createNewNoteInBookCtrl)

router.get('/:bookId', passport.authenticate('jwt', { session: false }), getAllNotesByBookIdCtrl)

router.get('/:bookId/:noteId', passport.authenticate('jwt', { session: false }), getOneNoteByNoteIdFromBookCtrl)

router.put('/:noteId', passport.authenticate('jwt', { session: false }), input(noteSchema), editOneNoteCtrl)

router.delete('/:bookId/:noteId', passport.authenticate('jwt', { session: false }), deleteOneNoteCtrl)

export { router }
